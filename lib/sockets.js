#!/usr/bin/env node

'use strict'

/**
 * Web-socket wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const sio = require(`socket.io`)
const he = require(`he`) // he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.

/**
 * All of the Socket.io stuff here for now.
 */
function everything (server) {
  return new Promise(resolve => {
    const io = sio.listen(server)
    const nicknames = {}
    io.sockets.on(`connection`, function (socket) {
      socket.on(`user message`, function (msg) {
        msg = he.encode(msg) // Encode any special HTML entities.
        socket.broadcast.emit(`user message`, socket.nickname, msg)
      })
      socket.on(`nickname`, function (nick, fn) {
        nick = nick.substring(0, 35) // Max length is 35
        if (nicknames[nick]) {
          fn(true) // Nickname already used.
        } else {
          fn(false)
          nicknames[nick] = socket.nickname = nick
          socket.broadcast.emit(`announcement`, `${nick} joined`)
        }
      })
      socket.on(`disconnect`, function () {
        if (!socket.nickname) return
        delete nicknames[socket.nickname]
        socket.broadcast.emit(`announcement`, `${socket.nickname} left`)
      })
    })
    resolve()
  })
}

module.exports = {
  everything: everything
}
