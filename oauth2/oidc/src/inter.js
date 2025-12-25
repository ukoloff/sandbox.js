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
  let details = await provider.interactionDetails(req, res)
  let result = {
    login: {
      accountId: req.body.u,
      oops: "Hi!",
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
