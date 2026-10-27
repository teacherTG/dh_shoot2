let endpoint = '';
let classCode = '';
export function configureClassApi(url:string,code:string){endpoint=url;classCode=code;}
export async function classFetch(path:string,init:RequestInit={}):Promise<Response>{
  if(!endpoint)return fetch(path,init);
  const action=(path.includes('roster')?'roster':'scores')+(init.method==='POST'?'.save':'.list');
  const response=await fetch(endpoint,{method:'POST',redirect:'follow',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,code:classCode,payload:init.body?JSON.parse(String(init.body)):undefined})});
  if(!response.ok)throw new Error('구글시트 연결을 확인해 주세요.');
  let data:{ok?:boolean;status?:number};
  try{data=await response.json() as typeof data}catch{throw new Error('저장 서버가 응답하지 않아요. 선생님께 알려 주세요.')}
  return new Response(JSON.stringify(data),{status:data.ok?200:(data.status||400),headers:{'Content-Type':'application/json'}});
}
