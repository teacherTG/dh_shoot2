import type { Student } from '../lib/roster';
type Attempt={id:string;classroom:number;student:number;score:number;createdAt:string;name?:string|null};
export function groupAttempts(records:Attempt[],students:Student[],classroom:number){
 const rows=new Map<string,{classroom:number;student:number;name:string;attempts:Attempt[]}>();
 for(const s of students)if(!classroom||s.classroom===classroom)rows.set(`${s.classroom}-${s.student}`,{...s,attempts:[]});
 for(const r of records){if(classroom&&r.classroom!==classroom)continue;const key=`${r.classroom}-${r.student}`;if(!rows.has(key))rows.set(key,{classroom:r.classroom,student:r.student,name:r.name||'',attempts:[]});rows.get(key)!.attempts.push(r)}
 return [...rows.values()].sort((a,b)=>a.classroom-b.classroom||a.student-b.student).map(r=>({...r,attempts:r.attempts.sort((a,b)=>Date.parse(a.createdAt)-Date.parse(b.createdAt)||a.id.localeCompare(b.id))}));
}
export default function AttemptTable({records,students,classroom,tier}:{records:Attempt[];students:Student[];classroom:number;tier:(score:number)=>readonly [string,number,string]}){
 const rows=groupAttempts(records,students,classroom),count=Math.max(1,...rows.map(r=>r.attempts.length));
 return <div className="table-scroll"><table aria-label="학생별 모든 도전 기록"><thead><tr>{!classroom&&<th scope="col">반</th>}<th scope="col">번호</th><th scope="col">이름</th>{Array.from({length:count},(_,i)=><th scope="col" key={i}>{i+1}차</th>)}<th scope="col">최고점</th><th scope="col">티어</th></tr></thead><tbody>{rows.map(r=>{const high=r.attempts.length?Math.max(...r.attempts.map(a=>a.score)):null;const t=high===null?null:tier(high);return <tr key={`${r.classroom}-${r.student}`}>{!classroom&&<td>{r.classroom}반</td>}<th scope="row">{r.student}번</th><td>{r.name||'미등록'}</td>{Array.from({length:count},(_,i)=>{const a=r.attempts[i];return <td key={i} title={a?new Date(a.createdAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'미응시'}>{a?`${a.score}점`:'—'}</td>})}<td className="score-cell">{high===null?'—':`${high}점`}</td><td style={{color:t?.[2]}}>{t?.[0]||'—'}</td></tr>})}</tbody></table></div>;
}
