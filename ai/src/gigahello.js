//
// Test run GigaChat
//
import GigaChat from 'gigachat'

const llm = new GigaChat()

res = await llm.chat('Привет, как дела?')
console.log(res)
