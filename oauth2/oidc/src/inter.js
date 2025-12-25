import express from 'express'

export async function url(ctx, interaction) {
  return `/inter/${interaction.uid}`
}

let provider
export function install(app, aProvider) {
  provider = aProvider
  app.get('/inter/:uid', form)
  app.post('/inter/:uid', express.urlencoded({ extended: true }), post)
}

async function form(req, res) {
  let details = await provider.interactionDetails(req, res)
  console.log(details)
  res.render('login')
}

async function post(req, res) {
  let details = await provider.interactionDetails(req, res)
  console.log(details)
  res.send('POST')
}
