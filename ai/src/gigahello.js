//
// Test run GigaChat
//
import  './env.js'
import GigaChat from 'gigachat'

const llm = new GigaChat()

res = await llm.chat('Привет, как дела?')
console.log(res)
