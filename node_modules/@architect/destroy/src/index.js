let aws = require('aws-sdk')
let waterfall = require('run-waterfall')
let deleteBucketContents = require('./_delete-bucket-contents')
let { updater } = require('@architect/utils')

/**
 * @param {object} params - named parameters
 * @param {string} params.name - name of cloudformation stack to delete
 * @param {boolean} params.force - deletes app with impunity, regardless of tables or buckets
 */
module.exports = function destroy (params, callback) {
  let { name: StackName, force = false, update } = params
  if (!update) update = updater('Destroy')

  // always validate input
  if (!StackName) {
    throw ReferenceError('Missing params.name')
  }

  // hack around no native promise in aws-sdk
  let promise
  if (!callback) {
    promise = new Promise(function ugh (res, rej) {
      callback = function errback (err, result) {
        if (err) rej(err)
        else res(result)
      }
    })
  }

  // actual code
  let region = process.env.AWS_REGION
  let cloudformation = new aws.CloudFormation({ region })

  waterfall([
    // Warning
    function (callback) {
      update.status(`Destroying ${StackName} in 5 seconds...`)
      setTimeout(() => {
        update.start(`Destroying ${StackName}`)
        callback()
      }, 5000)
    },

    // check for the stack
    function (callback) {
      cloudformation.describeStacks({
        StackName
      },
      function (err, data) {
        if (err) callback(err)
        else {
          let bucket = o => o.OutputKey === 'BucketURL'
          let hasBucket = data.Stacks[0].Outputs.find(bucket)
          callback(null, hasBucket)
        }
      })
    },

    // delete static assets
    function (bucketExists, callback) {
      if (bucketExists && force) {
        let bucket = bucketExists.OutputValue.replace('http://', '').replace('https://', '').split('.')[0]
        deleteBucketContents({
          bucket
        }, callback)
      }
      else if (bucketExists && !force) {
        // throw a big error here
        callback(Error('bucket_exists'))
      }
      else {
        callback()
      }
    },

    function (callback) {
      cloudformation.describeStackResources({
        StackName
      },
      function (err, data) {
        if (err) callback(err)
        else {
          let type = t => t.ResourceType
          let table = i => i === 'AWS::DynamoDB::Table'
          let hasTables = data.StackResources.map(type).some(table)
          callback(null, hasTables)
        }
      })
    },

    function (hasTables, callback) {
      if (hasTables && !force) {
        callback(Error('table_exists'))
      }
      else {
        // got this far, delete everything
        cloudformation.deleteStack({
          StackName,
        },
        function (err) {
          if (err) callback(err)
          else callback()
        })
      }
    },

    // poll for progress
    function (callback) {
      let tries = 1
      let max = 6
      function checkit () {
        cloudformation.describeStacks({
          StackName
        },
        function done (err) {
          let msg = `Stack with id ${StackName} does not exist` // Specific AWS message
          if (err && err.code == 'ValidationError' && err.message == msg) {
            update.done(`Successfully destroyed ${StackName}`)
            callback()
          }
          else {
            setTimeout(function delay () {
              if (tries === max) {
                callback(Error('Destroy failed; hit max retries'))
              }
              else {
                tries += 1
                checkit()
              }
            }, 10000 * tries)
          }
        })
      }
      checkit()
    }

  ], callback)

  // only happens if there is no callback
  return promise
}
