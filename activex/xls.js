const winax = require('winax')


const x = winax.Object('Excel.Application')
x.Visible = true
x.Workbooks.Add()
x.Cells(1, 1).Value = 'Hello, world!'
