//
// Dump Chroma DB
//
import fs from 'node:fs'
import path from 'node:path'
import { ChromaClient, knownEmbeddingFunctions } from 'chromadb'
import { stringify } from 'yaml'

const client = new ChromaClient({
  // path: 'http://localhost:8000',
})

const cname = 'kb.gigaR'

const coll = await client.getOrCreateCollection({ name: cname })

let docs = await coll.get()

let dst = fs.createWriteStream(path.join(import.meta.dirname, '..', 'out', `${cname}.yml`))

for (let i of docs.ids.keys())
  dst.write(stringify([{
    id: docs.ids[i],
    meta: docs.metadatas[i],
    text: docs.documents[i],
  }]))

  dst.close()
