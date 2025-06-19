const cluster = require('node:cluster');
const process = require('node:process');

require('dotenv').config()

if (cluster.isPrimary) {
  // console.log("MAIN:", process.pid)
  const numCPUs = +process.env.numchildren || 1
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log("RIP:", worker.process.pid)
    cluster.fork()
  });

  if (process.env.dev) {
    require('./watch')
  }

} else {
  console.log("WORKER:", process.pid)
  require("./www")
}
