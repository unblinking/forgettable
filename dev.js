#!/usr/bin/env node

'use strict'

/**
 * Starts the Forgettable chat in development mode.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const app = require(`./app`)

// Basic required environment variables
process.env.PORT = `1138`

app.main()
