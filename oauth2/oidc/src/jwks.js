import { generateKeyPair, exportJWK } from "jose";

export async function makeKeys() {
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
