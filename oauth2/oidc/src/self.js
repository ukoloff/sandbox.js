//
// OIDC request to localhost
//
import { Router } from 'express'
import session from 'express-session'
import { randomUUID } from 'node:crypto'
import { authorizationCodeGrant, buildAuthorizationUrl, calculatePKCECodeChallenge, discovery, fetchUserInfo, randomPKCECodeVerifier, randomState, allowInsecureRequests } from 'openid-client'

let self = Router()
export default self

let sess = session({
  name: 'self',
  secret: randomUUID(),
  cookie: {
    path: '/self'
  },
})
self.use(sess)

let config

self.get('/login', login)
self.get('/logout', logout)
self.get('/callback', callback)

async function login(req, res) {
  await ensureConfig()
  let code_verifier = randomPKCECodeVerifier()
  req.session.code_verifier = code_verifier
  let code_challenge = await calculatePKCECodeChallenge(code_verifier)
  let parameters = {
    redirect_uri: 'http://localhost:3000/self/callback',
    scope: 'openid email profile',
    code_challenge,
    code_challenge_method: 'S256',
  }
  if (!config.serverMetadata().supportsPKCE()) {
    var state = randomState()
    parameters.state = state
    req.session.state = state
  }
  let redirectTo = buildAuthorizationUrl(config, parameters)
  res.redirect(redirectTo)
}

async function logout(req, res) {
  await ensureConfig()
  res.send('logout')
}

async function callback(req, res) {
  await ensureConfig()
  res.send('callback')
}

async function ensureConfig() {
  if (config)
    return
  config = await discovery(new URL('http://localhost:3000/realms/uxm'), 'foo', 'bar', null, { execute: [allowInsecureRequests] })
}
