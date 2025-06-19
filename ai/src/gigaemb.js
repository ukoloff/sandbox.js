//
// Test run GigaChat
//
import './env.js'
import GigaChat from 'gigachat'

const llm = new GigaChat()

const res = await llm.embeddings(['Ну, чё новенького-то на Плюке?'])
console.log(res.data[0].embedding)
