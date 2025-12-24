import { Router } from 'express'
import session from 'express-session'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseEnv } from 'node:util'
import { authorizationCodeGrant, buildAuthorizationUrl, calculatePKCECodeChallenge, discovery, randomNonce, randomPKCECodeVerifier, randomState } from 'openid-client'


let kcloak = Router()
export default kcloak

let sess = session({
  name: 'kcloak',
  secret: randomUUID(),
  cookie: {
    path: '/kcloak'
  },
})
kcloak.use(sess)

let config

kcloak.get('/login', login)
kcloak.get('/logout', logout)
kcloak.get('/callback', callback)

//
// Kontur.Talk URL:
// https://kcloak.ekb.ru/realms/uxm/protocol/openid-connect/auth?state=f70b5221-461a-4446-a2ba-b91c6aeb8b3b&client_id=kontur&redirect_uri=https%3A%2F%2Fauth-gateway.kontur.ru%2Flogin%2Fcallback&response_type=code&scope=openid%20email%20profile
//
async function login(req, res) {
  await ensureConfig()
  let code_verifier = randomPKCECodeVerifier()
  req.session.code_verifier = code_verifier
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
    var state = randomState()
    parameters.state = state
    req.session.state = state
    // var nonce = randomNonce()
    // parameters.nonce = nonce
    // req.session.nonce = nonce
  }
  let redirectTo = buildAuthorizationUrl(config, parameters)
  res.redirect(redirectTo)
}

async function logout(req, res) {
  await ensureConfig()
  res.redirect(config.serverMetadata()['end_session_endpoint'])
}

async function callback(req, res) {
  await ensureConfig()
  let tokens = await authorizationCodeGrant(config, new URL(`http://localhost:3000/kcloak${req.url}`), {
    // expectedNonce: req.session.nonce,
    expectedState: req.session.state,
    pkceCodeVerifier: req.session.code_verifier,
    idTokenExpected: true,
  })
  res.json({ tokens, claims: tokens.claims() })
}

async function ensureConfig() {
  if (config)
    return
  const env = parseEnv(await readFile(join(import.meta.dirname, '../../.env'), 'utf-8'))
  config = await discovery(new URL(`https://kcloak.ekb.ru/realms/${env.REALM}`), env.CLIENTID, env.CLIENTSECRET)
}
