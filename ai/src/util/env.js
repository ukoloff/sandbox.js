import { globalAgent } from 'https'
import { getCACertificates } from 'node:tls'
import { config } from 'dotenv'

config({ path: import.meta.dirname + '/../../.env' })

// Added in: Node.js v22.15.0
globalAgent.options.ca = getCACertificates('system')
