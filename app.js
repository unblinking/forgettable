#!/usr/bin/env node

'use strict'

/**
 * Bremertown Chatroom
 * Super simple online chatroom.
 * @author {@link https://github.com/jmg1138 jmg1138}
 * Repo {@link https://github.com/nothingworksright/bremertown_chatroom Bremertown}
 * Forked from {@link https://github.com/lstoll/socket-io-chat-heroku lstoll}
 */

const frontends = require(`./lib/frontends`)
const funs = require(`./lib/funs`)
const sockets = require(`./lib/sockets`)

/**
 * Create the chat application parts in the right order.
 */
async function main () {
  try {
    let express = await frontends.expressInstance()
    await frontends.expressConfigure(express)
    await frontends.expressRoutes(express)
    await frontends.expressErrors(express)
    let server = await frontends.serverInstance(express)
    await frontends.serverListen(server)
    await sockets.everything(server)
    console.log(await funs.graffiti())
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  main: main
}
