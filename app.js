#!/usr/bin/env node

'use strict'

/**
 * Bremertown - Another chat.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const frontends = require(`./lib/frontends`)
const funs = require(`./lib/funs`)
const sockets = require(`./lib/sockets`)

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
