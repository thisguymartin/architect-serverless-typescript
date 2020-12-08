import arc from '@architect/functions';

export async function handler(req: any){
  let name = 'goodman-status'
  let payload = JSON.parse(req.Records[0].body)
  await arc.queues.publish({name, payload})  
  return 
}