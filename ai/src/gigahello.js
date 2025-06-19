//
// Test run GigaChat
//
import './env.js'
import { Agent } from 'node:https'
import { getCACertificates } from 'node:tls'
import GigaChat from 'gigachat'

const httpsAgent = new Agent({
  // rejectUnauthorized: false, // Отключает проверку корневого сертификата
  ca: getCACertificates('system')
})

const llm = new GigaChat({ httpsAgent })

var res = await llm.chat('Привет, как дела?')
console.log(res.choices[0].message.content)
