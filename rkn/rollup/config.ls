require! <[
  @rollup/plugin-commonjs
  @rollup/plugin-node-resolve
]>

module.exports = config

extensions = <[ .js .ls ]>

function config args
  input:  \./src/index.js
  external: require \module .builtin-modules
  output:
    dir: \out
    sourcemap: true
  plugins:
    plugin-commonjs {extensions}
    plugin-node-resolve {extensions}
