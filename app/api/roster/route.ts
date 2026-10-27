import { scoreDb } from '@/lib/score-db';
import { validateRoster } from '@/lib/roster';
export async function GET(){
 try {const {results}=await scoreDb().prepare('SELECT classroom,student,name FROM roster ORDER BY classroom,student').all();return Response.json({students:results},{headers:{'Cache-Control':'no-store'}})}
 catch(e){console.error(e);return Response.json({error:'명렬표를 불러오지 못했어요. 다시 시도해 주세요.'},{status:503})}
}
export async function POST(request:Request){
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'잘못된 요청입니다.'},{status:403});
 let students;
 try {const text=await request.text();if(text.length>50000)throw new Error('명렬표가 너무 커요. 250명 이내로 등록해 주세요.');students=validateRoster(JSON.parse(text)?.students)}
 catch(e){return Response.json({error:e instanceof Error?e.message:'명렬표 내용을 확인해 주세요.'},{status:400})}
 try {const db=scoreDb();await db.batch(students.map(s=>db.prepare('INSERT INTO roster (classroom,student,name) VALUES (?,?,?) ON CONFLICT(classroom,student) DO UPDATE SET name=excluded.name').bind(s.classroom,s.student,s.name)));return Response.json({saved:students.length})}
 catch(e){console.error(e);return Response.json({error:'명렬표를 저장하지 못했어요. 미리보기를 유지했으니 다시 저장해 주세요.'},{status:503})}
}
