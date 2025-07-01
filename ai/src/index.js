import "./util/env.js"
import sql from "./util/sql.js"
import sql2it from "./util/sql2it.js"
import {MarkdownTextSplitter} from 'langchain/text_splitter'

console.log("Hello, world!")

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

let splitter = new MarkdownTextSplitter({chunkSize: 1000, chunkOverlap: 200})

let N = 0
for await (let row of sql2it(q)) {
  let doc = {
    pageContent: `# ${row.title}\n\n${row.md}`,
    metadata: {
      key: row.id,
      hash: row.hash,
    },
  }
  let docs = await splitter.invoke([doc])
  let count = 0
  for (let doc of docs) {
    doc.metadata.chunk = ++count
  }
  console.log(++N, row.id.toString('hex'), row.hash.toString('hex'), row.title)
}

await db.close()
