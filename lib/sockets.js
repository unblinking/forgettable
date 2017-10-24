#!/usr/bin/env node

'use strict'

/**
 * Web-socket wrapper functions.
 */


const sio = require(`socket.io`)

/**
 * All of the Socket.io stuff here for now.
 */
function everything (server) {
  return new Promise(resolve => {
    const io = sio.listen(server)
    const nicknames = {}
    io.sockets.on(`connection`, function (socket) {
      socket.on(`user message`, function (msg) {
        socket.broadcast.emit(`user message`, socket.nickname, msg)
      })
      socket.on(`nickname`, function (nick, fn) {
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
