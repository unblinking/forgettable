#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of a fatal error during app.js startup.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const intercept = require(`intercept-stdout`)
const mute = require(`mute`)
const util = require(`util`)

const setTimeoutPromise = util.promisify(setTimeout)

describe(`App.js (the main app script)`, async () => {
  it(`should start the app successfully.`, async () => {
    const exit = process.exit
    process.env.APP_EXIT = `false`
    process.exit = () => { process.env.APP_EXIT = `true` }
    process.env.PORT = 1138
    let unhook = intercept(txt => { return `` }) // Begin muting stdout.
    const app = require(`../../app`)
    app.main()
    await setTimeoutPromise(3000) // Wait 3 seconds for the app to finish starting.
    process.env.APP_EXIT.should.equal(`false`)
    unhook() // Stop muting stdout.
    process.exit = exit // Reset process.exit as it was.
    // Delete the require.cache instance for the app, so that it may be
    // required again fresh in the next test.
    delete require.cache[require.resolve(`../../app`)]
    delete process.env.APP_EXIT
    delete process.env.PORT
  })
  it(`should cause a fatal error when env vars are not set.`, async () => {
    const exit = process.exit
    process.exit = () => { process.env.FATAL_APP_TEST = `exited` }
    let unmute = mute() // Begin muting stdout and stderr.
    const fatalApp = require(`../../app`)
    fatalApp.main()
    await setTimeoutPromise(1000) // Wait for the app to error.
    process.env.FATAL_APP_TEST.should.equal(`exited`)
    unmute() // Stop muting stdout and stderr.
    process.exit = exit // Reset process.exit as it was.
    // Delete the require.cache instance for the app, so that it may be
    // required again fresh in the next test.
    delete require.cache[require.resolve(`../../app`)]
    delete process.env.FATAL_APP_TEST
  }
)
})
