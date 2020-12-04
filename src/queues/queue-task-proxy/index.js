let arc = require('@architect/functions')

// learn more about queue functions here: https://arc.codes/primitives/queues
exports.handler = async function queue (event) {
  let name = 'goodman-status'
  let payload = JSON.parse(event.Records[0].body)
  await arc.queues.publish({name, payload})  
  return 
}