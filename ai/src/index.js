import "./util/env.js"
import sql from "./util/sql.js"
import sql2it from "./util/sql2it.js"

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

let N = 0
for await (let row of sql2it(q)) {
  console.log(++N, row.id.toString('hex'), row.hash.toString('hex'), row.title)
}

await db.close()
