#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit testing.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

describe(`Unit testing`, () => {
  before(() => {
    // any prep go here
  })
  it(`should find that NODE_ENV has been set to test.`, () =>
    process.env.NODE_ENV.should.equal(`test`)
  )
  after(() => {
    // Unit tests, required in special order of execution.
  })
})
