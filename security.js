const { createHmac } = require('crypto')

// Use HMAC SHA256
function validateRequest (event) {
  const isDev = (process.env.NODE_ENV && process.env.NODE_ENV === 'development')
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET

  const timestamp = event.headers['X-Slack-Request-Timestamp']
  const slackSignature = event.headers['X-Slack-Signature']

  if (!timestamp || !slackSignature) {
    console.log('[TOKEN_VALIDATION] Header is missing throw exception')
    if (!isDev) { throw new Error('Timestamp or sginature is missing') }
  }

  const now = Math.floor(new Date().getTime() / 1000)
  const calcTime = Math.abs(now - timestamp)
  if (calcTime > 60 * 5) {
    console.log(`[TOKEN_VALIDATION]Invalid time request ${calcTime}`)
    if (!isDev) { throw new Error('Timestamp validation failed') }
  }

  const sigBasestring = `v0:${timestamp}:${event.body}`

  const hex = createHmac('sha256', slackSigningSecret).update(sigBasestring).digest('hex')
  const mySignature = `v0=${hex}`

  if (mySignature !== slackSignature) {
    console.log('[TOKEN_VALIDATION]Signature is invalid')
    if (!isDev) { throw new Error('Invalid slack message') }
  }
  console.log('[TOKEN_VALIDATION]validation ok')
}

module.exports = {
  validateRequest
}
