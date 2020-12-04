let arc = require('@architect/functions')
const goodmanStatusMapper = require('./goodmanStatusMapper')
// learn more about queue functions here: https://arc.codes/primitives/queues
exports.handler = async function queue (event) {
  const body = JSON.parse(event.Records[0].body)
  let status = goodmanStatusMapper(body);
  console.log("Goodman Status we will do something", status)
  return

}