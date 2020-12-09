[<img src="https://s3-us-west-2.amazonaws.com/arc.codes/architect-logo-500b@2x.png" width=500>](https://www.npmjs.com/package/@architect/destroy)

## [`@architect/destroy`](https://www.npmjs.com/package/@architect/destroy)

> Architect serverless framework module for destroying projects created with Architect

[![GitHub CI status](https://github.com/architect/destroy/workflows/Node%20CI/badge.svg)](https://github.com/architect/destroy/actions?query=workflow%3A%22Node+CI%22)


Architect Destroy destroys Architect-generated projects. More specifically, it destroys your projects' CloudFormation stacks, and if called with `--force` (or the `force` param via API), destroys your DynamoDB (`@tables`) databases and S3 buckets and assets (`@static`).


## API

### `destroy({ name, force }, callback)`

Destroys all infrastructure associated to your Architect app.

`name`, the CloudFormation stack name of the app in question, must be passed.

`force` proceeds to destroy your app if it contains DynamoDB tables and / or S3 buckets.
