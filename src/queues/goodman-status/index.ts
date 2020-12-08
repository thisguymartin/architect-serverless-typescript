import goodmanStatusMapper from './goodmanStatusMapper'

export async function handler(event: any){
  const body = JSON.parse(event.Records[0].body)
  let status = goodmanStatusMapper(body);
  console.log("Goodman Status we will do something", status)
  return

}