import { Provider } from "oidc-provider"
import { generateKeyPair, exportJWK } from 'jose'

await makeKeys()

const provider = new Provider("http://localhost:3000", {
  // refer to the documentation for other available configuration
  jwks: await makeKeys(),
  clients: [
    {
      client_id: "foo",
      client_secret: "bar",
      redirect_uris: ["http://localhost:8080/cb"],
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
  }
})

const server = provider.listen(3000, () => {
  console.log(
    "oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration",
  )
})

async function makeKeys() {
  {
    let { publicKey, privateKey } = await generateKeyPair('EdDSA', { extractable: true })
    var ed = {
      use: 'sig',
      kid: 'A',
      alg: 'EdDSA',
      ...await exportJWK(privateKey)
    }
  }

  {
    let { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true })
    var rsa = {
      use: 'sig',
      kid: 'B',
      alg: 'RS256',
      ...await exportJWK(privateKey)
    }
  }
  return { keys: [ed, rsa] }
}
