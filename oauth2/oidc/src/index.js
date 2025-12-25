import express from 'express'
import { join } from 'node:path'
import { Provider } from "oidc-provider"
import { makeKeys } from "./jwks.js"
import kcloak from './kcloak.js'
import self from './self.js'
import * as inter from './inter.js'
import adapter from './adapter.js'

// https://github.com/panva/node-oidc-provider/blob/main/example/express.js
const {
  PORT = 3000,
  BASE = `http://localhost:${PORT}`,
  PREFIX = '/realms/uxm',
  ISSUER = `${BASE}${PREFIX}` } = process.env

await makeKeys()

const provider = new Provider(ISSUER, {
  // refer to the documentation for other available configuration
  jwks: await makeKeys(),
  adapter: await adapter(),
  findAccount: inter.findAccount,
  // scopes: ['openid', 'offline_access', 'email', 'profile'],
  claims: {
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale',
      'middle_name', 'name', 'nickname', 'picture', 'preferred_username',
      'profile', 'updated_at', 'website', 'zoneinfo'],
  },
  clients: [
    {
      client_id: "foo",
      client_secret: "bar",
      redirect_uris: ['http://localhost:3000/self/callback'],
      post_logout_redirect_uris: ['http://localhost:3000/'],
      // ... other client properties
    },
  ],
  routes: {
    jwks: '/protocol/openid-connect/certs',
    authorization: '/protocol/openid-connect/auth',
    token: '/protocol/openid-connect/token',
    userinfo: '/protocol/openid-connect/userinfo',
    end_session: '/protocol/openid-connect/logout',
    pushed_authorization_request: '/protocol/openid-connect/ext/par/request',
  },
  async issueRefreshToken(ctx, client, code) {
    return true
  },
  ttl: {
    Interaction: 60 * 60,
    Session: 1209600, /* 14 days in seconds */
    Grant: 1209600, /* 14 days in seconds */
    AccessToken: 60 * 60,
    IdToken: 60 * 60,
    RefreshToken: 14 * 24 * 60 * 60,
  },
  interactions: {
    url: inter.url,
  },
  features: {
    devInteractions: { enabled: false },
  },
})

const app = express()
app.set('views', join(import.meta.dirname, 'views'))
app.set('view engine', 'pug')
app.use(PREFIX, provider.callback())
app.use('/kcloak', kcloak)
self(app)
app.get('/', home)
inter.install(app, provider)

let server = app.listen(PORT, $ => {
  console.log(`application is listening on port ${PORT}, head to: ${BASE}`)
})

function home(req, res) {
  res.render('home', {
    title: 'Hello, world',
    url: `${ISSUER}/.well-known/openid-configuration`
  })
}
