/**
 * Module dependencies.
 */
const expressjs = require(`express`)
const helmet = require(`helmet`)
const http = require(`http`)
const path = require(`path`)
const sio = require(`socket.io`)

/**
 * Instantiate the express.js application.
 */
function expressInstance () {
  return new Promise(resolve => {
    let express = expressjs()
    resolve(express)
  })
}

/**
 * Configure the express.js application.
 * Define all express configurations here (except routes, define routes last).
 * @param {Object} express The expressjs instance.
 */
function expressConfigure (express) {
  return new Promise(resolve => {
    express.use(helmet())
    express.use(expressjs.static(path.join(__dirname, `/public`)))
    express.set(`views`, __dirname)
    express.set(`view engine`, `pug`)
    express.locals.pretty = true
    resolve()
  })
}

/**
 * Define the express.js routes.
 * @param {Object} express The expressjs instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 */
function expressRoutes (express) {
  return new Promise(resolve => {
    express.get(`/`, (req, res) => res.render(`index`, { layout: false }))
    resolve()
  })
}

/**
 * Define the express.js error handling middleware.
 * @param {Object} express The expressjs instance.
 */
function expressErrors (express) {
  return new Promise(resolve => {
    express.use((req, res, next) => res.status(404).send(`four, oh four!`))
    express.use((err, req, res, next) => {
      res.status(500).send(`five hundred!`)
      console.log(err.message)
    })
    resolve()
  })
}

/**
 * Instantiate the http server.
 * @param {Object} express The expressjs instance.
 */
function serverInstance (express) {
  return new Promise(resolve => {
    let server = http.Server(express)
    resolve(server)
  })
}

/**
 * Listen for http server connections.
 * @param {Object} server The http server instance.
 */
function serverListen (server) {
  return new Promise(resolve => {
    const port = parseInt(process.env.PORT, 10) || 1138
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`)
      resolve()
    })
  })
}

/**
 * Socket.io stuff here for now.
 */
function socketIoStuff(server) {
  return new Promise(resolve => {
    const io = sio.listen(server)
    const nicknames = {}
    io.sockets.on(`connection`, function (socket) {
      socket.on(`user message`, function (msg) {
        socket.broadcast.emit(`user message`, socket.nickname, msg)
      })
      socket.on(`nickname`, function (nick, fn) {
        if (nicknames[nick]) { // if the nickname is already used
          fn(true)
        } else {
          fn(false)
          nicknames[nick] = socket.nickname = nick
          socket.broadcast.emit(`announcement`, `${nick} connected`)
        }
      })
      socket.on(`disconnect`, function () {
        if (!socket.nickname) return
        delete nicknames[socket.nickname]
        socket.broadcast.emit(`announcement`, `${socket.nickname} disconnected`)
      })
    })
    resolve()
  })
}

/**
 * Create the chat application parts in the right order.
 */
async function create () {
  let express = await expressInstance()
  await expressConfigure(express)
  await expressRoutes(express)
  await expressErrors(express)
  let server = await serverInstance(express)
  await serverListen(server)
  await socketIoStuff(server)
}
create()
