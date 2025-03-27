require('dotenv').config()
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
app.get('/auth/callback', logged)

app.listen(process.env.port || 80)

function home(req, res) {
  res.send(`
    <li><a href=/auth/>Auth</a>!
    `)
}

function login(req, res) {
  res.redirect(kcloak.code.getUri())
}

async function logged(req, res) {
  let user = await kcloak.code.getToken(req.originalUrl)
  console.log(user)
  res.send("Success")
}
