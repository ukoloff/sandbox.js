import { exportJWK, generateKeyPair } from "jose"
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
  {
    let { privateKey } = await generateKeyPair('EdDSA', { extractable: true });
    var ed = {
      use: 'sig',
      kid: 'A',
      alg: 'EdDSA',
      ...await exportJWK(privateKey)
    };
  }

  {
    let { privateKey } = await generateKeyPair('RS256', { extractable: true });
    var rsa = {
      use: 'sig',
      kid: 'B',
      alg: 'RS256',
      ...await exportJWK(privateKey)
    };
  }
  return { keys: [ed, rsa] };
}
