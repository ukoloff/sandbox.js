//
// OIDC request to localhost
//
import { Router } from 'express'
import session from 'express-session'
import { randomUUID } from 'node:crypto'
import { authorizationCodeGrant, buildAuthorizationUrl, calculatePKCECodeChallenge, discovery, fetchUserInfo, randomPKCECodeVerifier, randomState, allowInsecureRequests } from 'openid-client'

let config

export default function self(app) {
  let self = Router()
  app.use('/self', self)

  let sess = session({
    name: 'self',
    secret: randomUUID(),
    cookie: {
      path: '/self'
    },
    resave: false,
    saveUninitialized: false,
  })
  self.use(sess)

  self.get('/login', login)
  self.get('/logout', logout)
  self.get('/callback', callback)
}

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
  res.redirect(redirectTo.href)
}

async function logout(req, res) {
  await ensureConfig()
  let url = new URL(config.serverMetadata()['end_session_endpoint'])
  url.searchParams.set('post_logout_redirect_uri', 'http://localhost:3000/')
  url.searchParams.set('client_id', config.clientMetadata().client_id)
  res.redirect(url.href)
}

async function callback(req, res) {
  await ensureConfig()
  let tokens = await authorizationCodeGrant(config, new URL(`http://localhost:3000${req.originalUrl}`), {
    expectedState: req.session.state,
    pkceCodeVerifier: req.session.code_verifier,
    idTokenExpected: true,
  })
  let claims = tokens.claims()
  let user = await fetchUserInfo(config, tokens.access_token, claims.sub)
  res.json({ tokens, claims, user })
}

async function ensureConfig() {
  if (config)
    return
  config = await discovery(new URL('http://localhost:3000/realms/uxm'), 'foo', 'bar', null, { execute: [allowInsecureRequests] })
}
