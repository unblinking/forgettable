#!/usr/bin/env node

'use strict'

/**
 * These functions put the fun in functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const packageJson = require(`../package.json`)

/**
 * Tag the console with some application name graffiti.
 * @see {@link https://patorjk.com/software/taag/#p=display&f=Stforek&t=Forgettable TAAG}
 * @see {@link https://stackoverflow.com/a/41407246 nodejs console font color}
 */
function graffiti () {
  return new Promise(resolve => {
    let art = `\x1b[1m\x1b[32m
 ___ __  ___  __ ___ _____ _____ __  __ _   ___  
| __/__\\| _ \\/ _] __|_   _|_   _/  \\|  \\ | | __| 
| _| \\/ | v / [/\\ _|  | |   | || /\\ | -< |_| _|  
|_| \\__/|_|_\\\\__/___| |_|   |_||_||_|__/___|___| 

\x1b[37mAlpha                 version ${packageJson.version}\x1b[0m
`
    resolve(art)
  })
}
exports.graffiti = graffiti
