'use strict'
const qs = require('querystring')
const security = require('./src/security')
const channel = require('./src/channel')
const search = require('./src/search')
const util = require('./src/util')
const cleartext = require('./src/cleartext')
const channelMessages = require('./src/channelMessages')
const interactivity = require('./src/interactivity')
const events = require('./src/event')
const user = require('./src/user')

module.exports.execute = async event => {
  try {
    util.logTrace(`Path to process ${event.path}`)
    security.validateRequest(event)
    event.body = qs.parse(event.body)

    if (event.path === '/renameChannel') {
      return await channel.renameChannel(event)
    }
    if (event.path === '/getMarcas') {
      return await cleartext.getMarcas(event)
    }
    if (event.path === '/getHelp') {
      return await cleartext.helpDeskMsg(event)
    }
    if (event.path === '/getHelpSlack') {
      return await cleartext.helpSlackMsg(event)
    }
    if (event.path === '/getInfo') {
      return await cleartext.info(event)
    }
    if (event.path === '/helpSlackScreen') {
      return await channelMessages.helpSlackScreen(event)
    }
    if (event.path === '/interactivity') {
      return await interactivity.execute(event)
    }
    if (event.path === '/googleCloudSearch') {
      return search.cloudSearchQuery(event)
    }
    if (event.path === '/moveSingleChannelUser') {
      return user.moveSingleChannel(event)
    }
    if (event.path === '/addMultiChannelUser') {
      return user.addMultiChannel(event)
    }
    if (event.path === '/events') {
      return await events.execute(event)
    }
    return util.createResponse(200, '*Invalid path*', `path: ${event.path}`)
  } catch (err) {
    console.log(err)
    return util.createResponse(200, '*General error*', err.errorMessage)
  }
}
