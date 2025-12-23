import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { generateKeyPair, exportJWK } from "jose"

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
    let { publicKey, privateKey } = await generateKeyPair('EdDSA', { extractable: true });
    var ed = {
      use: 'sig',
      kid: 'A',
      alg: 'EdDSA',
      ...await exportJWK(privateKey)
    };
  }

  {
    let { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true });
    var rsa = {
      use: 'sig',
      kid: 'B',
      alg: 'RS256',
      ...await exportJWK(privateKey)
    };
  }
  return { keys: [ed, rsa] };
}
