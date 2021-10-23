
function createResponse (statusCode, title, text) {
  const response = {
    blocks: []
  }

  if (title) {
    response.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: title
      }
    })
  }
  if (text) {
    response.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: text
      }
    })
  }

  return {
    statusCode,
    body: JSON.stringify(response)
  }
}

function getTraceId (event) {
  return event.headers['X-Amz-Cf-Id']
}

// logic from https://api.slack.com/methods/users.info
// membro > is_restricted, is_ultra_restricted: | both are false
// multi channel  is_restricted: true > is_ultra_restricted: false
// single channel is_restricted: true, is_ultra_restricted: true,
function getMemberType (member) {
  const isRestricted = member.user.is_restricted
  const isUltraRestricted = member.user.is_ultra_restricted
  if (isRestricted && isUltraRestricted) {
    return 'SINGLE'
  } else if (isRestricted && !isUltraRestricted) {
    return 'MULTI'
  }
  return 'FULL'
}

// text=<@W0162P5JMCP|harlen.naves>
function parseUserData (data) {
  const rawData = data.replace('<', '').replace('>', '').split('|')
  const userId = rawData[0].replace('@', '')
  const displayName = rawData[1]
  return {
    userId,
    displayName
  }
}

function logTrace (msg) {
  if (process.env.LOG_TRACE && process.env.LOG_TRACE === 'true') {
    console.log(msg)
  }
}

function getLink (title, link) {
  return `<${link}|${title}>`
}

function getEnter (count = 1) {
  let enters = ''
  for (let i = 0; i < count; i++) {
    enters += '\n'
  }
  return enters
}

function prepareTextMessage (list) {
  let msg = ''
  for (const item of list) {
    if (item === undefined) {
      continue
    }
    msg += item
  }
  return msg
}

function getUserName (event) {
  return event.body.user_name
}

function getText (...text) {
  let tmp = ''
  for (const item of text) {
    if (item === undefined) {
      continue
    }
    tmp += item + ' '
  }
  return tmp.trim()
}

function ack () {
  return {
    statusCode: 200
  }
}

module.exports = {
  getTraceId,
  createResponse,
  getMemberType,
  parseUserData,
  logTrace,
  getLink,
  getEnter,
  prepareTextMessage,
  getUserName,
  getText,
  ack
}
