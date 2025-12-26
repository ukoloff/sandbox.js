import express from 'express'

let provider

export async function url(ctx, interaction) {
  return `/login/${interaction.uid}`
}

export function install(app, aProvider) {
  provider = aProvider
  app.get('/login/:uid', form)
  app.post('/login/:uid', express.urlencoded({ extended: true }), post)
}

async function form(req, res) {
  let details = await provider.interactionDetails(req, res)
  switch (details.prompt.name) {
    case 'login':
      res.render('login')
      break
    case 'consent':
      await provider.interactionFinished(req, res, await grantAll(details), { mergeWithLastSubmission: true })
      break
  }
}

async function post(req, res) {
  if (req.body.p != '.') {
    res.render('login', {
      u: req.body.u,
      err: 'Неверный логин или пароль!'
    })
    return
  }
  let details = await provider.interactionDetails(req, res)
  let result = {
    login: {
      accountId: req.body.u,
    }
  }
  await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
}

async function grantAll(details) {
  let { grantId } = details
  if (grantId) {
    var grant = await provider.Grant.find(grantId)
  } else {
    grant = new provider.Grant({
      accountId: details.session.accountId,
      clientId: details.params.client_id,
    })
  }
  let d = details.prompt.details

  if (d.missingOIDCScope) {
    grant.addOIDCScope(d.missingOIDCScope.join(' '));
  }
  if (d.missingOIDCClaims) {
    grant.addOIDCClaims(d.missingOIDCClaims);
  }
  if (d.missingResourceScopes) {
    for (const [indicator, scopes] of Object.entries(d.missingResourceScopes)) {
      grant.addResourceScope(indicator, scopes.join(' '));
    }
  }
  let grantId2 = await grant.save()
  const consent = {};
  if (!grantId) {
    consent.grantId = grantId2
  }
  return { consent }
}
