var edge = require('edge-js');

var helloWorld = edge.func(`
    async (input) => {
        return ".NET Welcomes " + input.ToString();
    }
`)

helloWorld('JavaScript', function (error, result) {
  if (error) throw error
  console.log(result)
})
