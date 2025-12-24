import { Router } from 'express'

let kcloak = Router()
export default kcloak

kcloak.get('/login', login)
kcloak.get('/logout', logout)
kcloak.get('/callback', callback)


function login(req, res) {
  res.send('Login')
}

function logout(req, res) {
  res.send('Logout')
}

function callback(req, res) {
  res.send('Callback')
}
