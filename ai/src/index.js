import "./util/env.js"
import sql from "./util/sql.js"
import sql2it from "./util/sql2it.js"
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { ChromaClient, knownEmbeddingFunctions } from 'chromadb'
import { GigaEmb } from "./gemb.js"

const client = new ChromaClient({
  // path: 'http://localhost:8000',
})

// await client.deleteCollection({name: 'kb.gigaRtext'})

const coll = await client.getOrCreateCollection({
  name: 'kb.gigaRtext',
  embeddingFunction: new GigaEmb(),
})

if (!await coll.count()) {
  await fill(coll)
}

async function fill(coll) {
  let splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 200
  })

  let db = await sql()
  let q = db.request()
  q.query(`
    With
      ${sql.pages},
      ${sql.spaces},
      ${sql.pagez()}
    Select
      id,
      md,
      title,
      HASHBYTES('SHA2_256', md) as hash
    From pagez
    Where
      md is not Null
    `)

  let N = 0
  for await (let row of sql2it(q)) {
    let doc = {
      pageContent: `<title>${row.title}</title>\n${row.md}`,
      metadata: {
        key: row.id.toString('hex'),
        hash: row.hash.toString('hex'),
      },
    }
    let docs = await splitter.invoke([doc])
    let count = 0
    for (let doc of docs) {
      let metadata = {
        key: doc.metadata.key,
        hash: doc.metadata.hash,
        chunk: ++count,
      }

      await coll.add({
        ids: [`${doc.metadata.key}-${count}`],
        metadatas: [metadata],
        documents: [doc.pageContent],
      })
    }
    console.log(++N, row.id.toString('hex'), row.hash.toString('hex'), row.title)
    console.log('<', docs.map($ => $.pageContent.length).join(', '), '>')
  }

  await db.close()
}
