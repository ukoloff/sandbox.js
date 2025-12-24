import { parseEnv } from 'node:util'
import { Router } from 'express'
import { discovery } from 'openid-client'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'


let kcloak = Router()
export default kcloak

let config

kcloak.get('/login', login)
kcloak.get('/logout', logout)
kcloak.get('/callback', callback)

async function login(req, res) {
  await ensureConfig()
  res.send('Login')
}

async function logout(req, res) {
  await ensureConfig()
  res.send('Logout')
}

async function callback(req, res) {
  await ensureConfig()
  res.send('Callback')
}

async function ensureConfig() {
  if (config)
    return
  const env = parseEnv(await readFile(join(import.meta.dirname, '../../.env'), 'utf-8'))
  config = await discovery(new URL(`https://kcloak.ekb.ru/realms/${env.REALM}`), env.CLIENTID, env.CLIENTSECRET)
}
