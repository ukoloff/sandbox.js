require! <[
  @rollup/plugin-commonjs
  @rollup/plugin-node-resolve
  ./livescript
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
    livescript!
    plugin-commonjs {extensions}
    plugin-node-resolve {extensions}
