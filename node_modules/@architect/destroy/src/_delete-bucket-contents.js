let aws = require('aws-sdk')
let waterfall = require('run-waterfall')

module.exports = function deleteBucketContents ({ bucket }, callback) {

  let region = process.env.AWS_REGION
  let s3 = new aws.S3({ region })

  waterfall([
    function (callback) {
      s3.listObjectsV2({ Bucket: bucket }, function done (err, result) {
        if (err) {
          callback(err)
        }
        else if (result.IsTruncated) {
          throw Error('bucket has too many objects to delete')
        }
        else {
          callback(null, result.Contents.map(item => ({ Key: item.Key })))
        }
      })
    },

    function (stuffToDelete, callback) {
      if (Array.isArray(stuffToDelete) && stuffToDelete.length > 0) {
        s3.deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: stuffToDelete
          }
        },
        function done (err) {
          if (err) callback(err)
          else callback()
        })
      }
      else {
        callback()
      }
    }
  ], callback)
}
