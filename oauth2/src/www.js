const express = require('express')
const oauth2 = require('client-oauth2')

const kcloak = new oauth2({
  clientId: process.env.clientid,
  clientSecret: process.env.clientsecret,
  authorizationUri: "https://kcloak.ekb.ru/realms/omz2/protocol/openid-connect/auth",
  accessTokenUri: "https://kcloak.ekb.ru/realms/omz2/protocol/openid-connect/token",
  redirectUri: "http://localhost/auth/callback",
  scopes: ['openid', 'email', 'profile'],
})

const app = express()

app.get('/', home)
app.get('/auth/', login)
app.get('/auth/off', logout)
app.get('/auth/callback', logged)

app.listen(process.env.port || 80)

function home(req, res) {
  res.send(`
    <li><a href=/auth/>Login</a>!
    <li><a href=/auth/off target=logoff>Logout</a>!
    `)
}

function login(req, res) {
  res.redirect(kcloak.code.getUri())
}

function logout(req, res) {
  // Consider adding post_logout_redirect_uri
  // https://stackoverflow.com/a/76152326/6127481
  res.redirect("https://kcloak.ekb.ru/realms/omz2/protocol/openid-connect/logout")
}


async function logged(req, res) {
  let user = await kcloak.code.getToken(req.originalUrl)
  // console.log(user)
  let data = user.sign({})
  // console.log(data)
  let r = await fetch("https://kcloak.ekb.ru/realms/omz2/protocol/openid-connect/userinfo", data)
  let j = await r.json()
  res.header("Content-Type", "application/json")
  res.send(JSON.stringify(j, null, 2))
}
