@app
architect-serverless-typescript

@http
post /queue-post
get /david

@queues
queue-task-proxy 
status-mapper

@aws
region us-west-1
