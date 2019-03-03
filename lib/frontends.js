#!/usr/bin/env node

'use strict'

/**
 * Front-end wrapper functions (express and http server objects).
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const errors = require(`./errors`)
const expressjs = require(`express`)
const helmet = require(`helmet`)
const http = require(`http`)
const path = require(`path`)

/**
 * Verify required env vars are set.
 */
function environmentals () {
  return new Promise((resolve, reject) => {
    let missing = ``
    if (process.env.PORT === undefined) { missing = missing.concat(`\n PORT`) }
    if (missing === ``) {
      resolve()
    } else {
      let error = new Error(`Environmental variable(s) missing:${missing}`)
      error.name = `EnvironmentalVariableError`
      reject(error)
    }
  })
}

/**
 * Instantiate the expressjs application.
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
 *
 */
function expressConfigure (express) {
  return new Promise(resolve => {
    express.use(helmet())
    express.use(expressjs.static(path.join(__dirname, `../public`)))
    express.set(`views`, `./views`)
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
 * Define the expressjs error handling middleware.
 * @param {Object} express The expressjs instance.
 */
function expressErrors (express) {
  return new Promise(resolve => {
    express.use(errors.handle404)
    express.use(errors.handle500)
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
    const port = parseInt(process.env.PORT, 10)
    server.listen(port, () => {
      // console.log(` Server listening on port ${port}`)
      resolve()
    })
  })
}

module.exports = {
  environmentals: environmentals,
  expressInstance: expressInstance,
  expressConfigure: expressConfigure,
  expressRoutes: expressRoutes,
  expressErrors: expressErrors,
  serverInstance: serverInstance,
  serverListen: serverListen
}
