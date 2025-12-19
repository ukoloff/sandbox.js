import { Provider } from "oidc-provider"

const provider = new Provider("http://localhost:3000", {
  // refer to the documentation for other available configuration
  clients: [
    {
      client_id: "foo",
      client_secret: "bar",
      redirect_uris: ["http://localhost:8080/cb"],
      // ... other client properties
    },
  ],
})

const server = provider.listen(3000, () => {
  console.log(
    "oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration",
  )
})
