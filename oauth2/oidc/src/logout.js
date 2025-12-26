import { promisify } from 'node:util'
let app

export default function setApp(anApp) {
  app = anApp
  return {
    enabled: true,
    logoutSource,
    postLogoutSuccessSource
  }
}

let render = promisify((...args) => app.render(...args))

async function logoutSource(ctx, form) {
  ctx.body = await render('logout', { form })
}

async function postLogoutSuccessSource(ctx) {
  ctx.body = await render('logout-ok')
}
