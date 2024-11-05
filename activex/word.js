const winax = require('winax')

const w = winax.Object('Word.Application')
w.Visible = true
w.Documents.Add()
w.Selection.TypeText('Hello, world!')
