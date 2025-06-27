import "./util/env.js"
import sql from "./util/sql.js"

console.log("Hello, world!")

let db = await sql()
let result = await db.request()
  .query(`Select GetDate()`)
console.log(result)
