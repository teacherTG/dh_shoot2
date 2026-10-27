import { scoreDb } from '@/lib/score-db';
export async function GET() {
 try { const { results } = await scoreDb().prepare('SELECT s.id, s.classroom, s.student, s.score, s.created_at AS createdAt, r.name FROM scores s LEFT JOIN roster r ON r.classroom=s.classroom AND r.student=s.student ORDER BY s.created_at DESC').all(); return Response.json({records:results}, {headers:{'Cache-Control':'no-store'}}); }
 catch(e) { console.error(e); return Response.json({error:'기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'},{status:503}); }
}
export async function POST(request: Request) {
 if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return Response.json({error:'잘못된 요청입니다.'},{status:403});
 let data; try { data = (await request.json() ?? {}) as Record<string, any>; } catch { return Response.json({error:'입력값을 확인해 주세요.'},{status:400}); }
 const { id, classroom, student, score } = data;
 if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/.test(id) || !Number.isInteger(classroom) || classroom<7 || classroom>11 || !Number.isInteger(student) || student<1 || student>50 || !Number.isInteger(score) || score<0 || score>100) return Response.json({error:'반(7~11), 번호(1~50), 점수(0~100 정수)를 확인해 주세요.'},{status:400});
 try { await scoreDb().prepare('INSERT INTO scores (id,classroom,student,score,created_at) VALUES (?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,classroom,student,score,new Date().toISOString()).run(); return Response.json({ok:true},{status:201}); }
 catch(e) {console.error(e); return Response.json({error:'저장하지 못했어요. 입력 내용은 그대로 두었으니 다시 시도해 주세요.'},{status:503});}
}


