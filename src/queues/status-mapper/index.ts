import statusMapper from './statusMapper'

export async function handler(event: any){
  const body = JSON.parse(event.Records[0].body)
  let status = statusMapper(body);
  console.log("Status we will do something", status)
  return

}