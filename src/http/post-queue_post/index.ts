import arc from '@architect/functions';

export async function handler(req: any){
    let body = arc.http.helpers.bodyParser(req)
    let name = 'queue-task-proxy'
    let payload = body
    await arc.queues.publish({name, payload})
    return {statusCode: 200, body:'Message Sent'}
}