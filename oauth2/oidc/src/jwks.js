import { exportJWK, generateKeyPair } from "jose"
import { randomUUID } from "node:crypto"
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function makeKeys() {
  const f = join(import.meta.dirname, '..', '.db', 'jwks.json')
  try {
    return JSON.parse(await readFile(f))
  }
  catch { }
  const keys = await newKeys()
  await writeFile(f, JSON.stringify(keys, null, 2))
  return keys
}

async function newKeys() {
  let result = []
  for (let alg of ['EdDSA', 'ES384', 'RS256']) {
    let { privateKey } = await generateKeyPair(alg, { extractable: true });
    result.push({
      use: 'sig',
      kid: randomUUID(),
      alg,
      ...await exportJWK(privateKey)
    })
  }
  return { keys: result }
}
