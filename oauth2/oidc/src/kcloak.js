import { Router } from 'express'

let kcloak = Router()
export default kcloak

kcloak.get('/login', login)
kcloak.get('/logout', logout)
kcloak.get('/callback', callback)


async function login(req, res) {
  res.send('Login')
}

async function logout(req, res) {
  res.send('Logout')
}

async function callback(req, res) {
  res.send('Callback')
}
