import sql from 'mssql'

export default function connect() {
  return sql.connect(parseConnectionString())
}

function parseConnectionString(url = process.env.DB_CONNECT) {
  let x = new URL(url)
  let config = {
    user: decodeURIComponent(x.username),
    password: x.password,
    server: x.hostname,
    database: x.pathname.replace(/^\/|\/$/, ''),
    options: {
      appName: 'uxm AI',
      trustServerCertificate: true,
    }
  }
  if (/\\/.test(config.user)) {
    [config.domain, config.user] = config.user.split('\\', 2)
  }
  if (/\//.test(config.database)) {
    [config.options.instanceName, config.database] = config.database.split('/', 2)
  }
  return config
}
