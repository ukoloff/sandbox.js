//
// Test run GigaChat
//
import './env.js'
import GigaChat from 'gigachat'

const llm = new GigaChat()

var res = await llm.chat('Ну, чё новенького-то на Плюке?')
console.log(res.choices[0].message.content)
