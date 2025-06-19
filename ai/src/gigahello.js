//
// Test run GigaChat
//
import './env.js'
import { Agent } from 'node:https'
import GigaChat from 'gigachat'

const httpsAgent = new Agent({
  rejectUnauthorized: false, // Отключает проверку корневого сертификата
})

const llm = new GigaChat({ httpsAgent })

var res = await llm.chat('Привет, как дела?')
console.log(res.choices[0].message.content)
