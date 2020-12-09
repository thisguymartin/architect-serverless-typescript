@app
architect-serverless-typescript

@http
post /queue-post

@queues
queue-task-proxy 
status-mapper


@aws
region us-west-1
bucket architect-serverless-typescript
