const slack = require('./slack')
const util = require('./util')

async function renameChannel (event) {
  util.logTrace('function renameChannel')
  const data = event.body
  util.logTrace(data)
  const channelId = data.channel_id
  const oldName = data.channel_name
  const newName = data.text.trim()

  if (oldName.indexOf(process.env.CHANNEL_BLACK_LIST) >= 0) {
    return util.createResponse(200, 'Canal bloqueado', `O canal ${oldName} não pode ser renomeado devido a políticas de acesso. Consulte seu administrador do slack.`)
  }

  if (newName.indexOf(' ') >= 0) {
    return util.createResponse(200, 'Nome inválido', 'O nome do canal não pode ter espaços, use -(traço) no lugar')
  }

  try {
    const request = { channel_id: channelId, name: newName }
    util.logTrace(request)
    await slack.renameChannel(process.env.SLACK_TOKEN_USER, request)
  } catch (err) {
    if (err.data) {
      if (err.data.error === 'channel_not_found') {
        return util.createResponse(200, 'Oppssss', `O canal informado não existe ${oldName}`)
      }
      if (err.data.error === 'invalid_name_specials') {
        return util.createResponse(200, 'Oppssss', 'O canal tem um nome inválido')
      }
      slack.logError(err)
    } else {
      slack.logGenericError(err)
    }
    return util.createResponse(200, 'Oppssss', `Não foi possível processar sua requisição, peça ajuda para um administrador. ${util.getTraceId(event)}`)
  }
  return util.createResponse(200, '*O canal foi renomeado*', `De ${oldName} para ${newName}`)
}

async function convertChannelToPrivate (event) {
  // https://api.slack.com/methods/admin.conversations.convertToPrivate
  // TO BE IMPLEMENTED
  return util.createResponse(200, '*Opção indisponível, será implementado*', '/convertChannelToPrivate')
}

module.exports = {
  renameChannel,
  convertChannelToPrivate
}
