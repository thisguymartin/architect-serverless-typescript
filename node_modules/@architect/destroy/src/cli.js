#!/usr/bin/env node
let _inventory = require('@architect/inventory')
let { banner, toLogicalID, updater } = require('@architect/utils')
let { version } = require('../package.json')

let destroy = require('./index.js')
let update = updater('Destroy')

if (require.main === module) {
  (async function () {
    try {
      await main(process.argv)
    }
    catch (err) {
      console.log(err)
    }
  })()
}

// TODO move CLI logic into CLI and turn other libs into stand alone pure modules
async function main (args) {
  let appname
  try {
    let inventory = await _inventory({})
    appname = inventory.inv.app

    let findName = p => p === '--name'
    let named = args.includes('--name') && (args[args.findIndex(findName) + 1] === appname)
    let forces = p => [ '-f', '--force', 'force' ].includes(p)
    let force = args.some(forces)
    let production = args.includes('--production')

    if (require.main === module) {
      banner({ inventory, version: `Destroy ${version}` })
    }
    if (!named) {
      throw Error('no_name')
    }
    let env = production ? 'production' : 'staging'
    update.status(`Destroying ${env} environment`)
    if (env === 'staging') {
      update.status(`Reminder: if you deployed to production, don't forget to run destroy again with: --production`)
    }
    let name = toLogicalID(`${appname}-${env}`)
    await destroy({ name, force, update })
  }
  catch (err) {
    let { message } = err
    let msg = 'To destroy this app (and any static assets and database tables that belong to it), run destroy with: --force'
    if (message === 'no_name') {
      update.warn(`If you're really sure you want to destroy this app, run destroy with: --name ${appname}`)
    }
    else if (message === 'bucket_exists') {
      update.warn(`Found static bucket!`)
      update.warn(msg)
    }
    else if (message === 'table_exists') {
      update.warn('Found DynamoDB table(s)!')
      update.warn(msg)
    }
    else {
      update.error(err)
    }
  }
}

module.exports = main
