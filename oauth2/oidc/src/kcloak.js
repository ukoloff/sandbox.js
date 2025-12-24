import { parseEnv } from 'node:util'
import { Router } from 'express'
import { buildAuthorizationUrl, calculatePKCECodeChallenge, discovery, randomNonce, randomPKCECodeVerifier, randomState } from 'openid-client'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'


let kcloak = Router()
export default kcloak

let config

kcloak.get('/login', login)
kcloak.get('/logout', logout)
kcloak.get('/callback', callback)

async function login(req, res) {
  await ensureConfig()
  let code_verifier = randomPKCECodeVerifier()
  let code_challenge = await calculatePKCECodeChallenge(code_verifier)
  let parameters = {
    redirect_uri: 'http://localhost:3000/kcloak/callback',
    scope: 'openid email profile',
    code_challenge,
    code_challenge_method: 'S256',
  }
  if (!config.serverMetadata().supportsPKCE()) {
    /**
     * We cannot be sure the server supports PKCE so we're going to use state too.
     * Use of PKCE is backwards compatible even if the AS doesn't support it which
     * is why we're using it regardless. Like PKCE, random state must be generated
     * for every redirect to the authorization_endpoint.
     */
    state = randomState()
    parameters.state = state
  }
  let redirectTo = buildAuthorizationUrl(config, parameters)
  res.send('Login: ' + redirectTo)
}

async function logout(req, res) {
  await ensureConfig()
  res.send('Logout')
}

async function callback(req, res) {
  await ensureConfig()
  res.send('Callback')
}

async function ensureConfig() {
  if (config)
    return
  const env = parseEnv(await readFile(join(import.meta.dirname, '../../.env'), 'utf-8'))
  config = await discovery(new URL(`https://kcloak.ekb.ru/realms/${env.REALM}`), env.CLIENTID, env.CLIENTSECRET)
}
