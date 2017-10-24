#!/usr/bin/env node

'use strict'

/**
 * Fun functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const packageJson = require(`../package.json`)

/**
 * The application name.
 * @see {@link http://patorjk.com/software/taag/#p=display&h=0&f=Straight&t=Bremertown TAAG}
 * @see {@link https://stackoverflow.com/a/41407246 nodejs console font color}
 */
function graffiti () {
  return new Promise(resolve => {
    let art = `\x1b[1m\x1b[32m
   __
  |__)  _  _  _   _  _ |_  _       _
  |__) |  (- ||| (- |  |_ (_) \\)/ | )

  \x1b[37mAlpha                 version ${packageJson.version}
`
    resolve(art)
  })
}
exports.graffiti = graffiti
