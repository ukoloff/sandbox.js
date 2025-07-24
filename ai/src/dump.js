//
// Dump Chroma DB
//
import { ChromaClient, knownEmbeddingFunctions } from 'chromadb'
import { stringify } from 'yaml'

const client = new ChromaClient({
  // path: 'http://localhost:8000',
})

const cname = 'kb.gigaR'

const coll = await client.getOrCreateCollection({ name: cname })

let docs = await coll.get()

console.log(docs)
