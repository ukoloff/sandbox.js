module.exports = config

function config args
  input:  \./src/index.js
  external: require \module .builtin-modules
  output:
    dir: \out
    sourcemap: true
