export type Student = { classroom:number; student:number; name:string };
export function validateRoster(input: unknown): Student[] {
 if(!Array.isArray(input)||input.length<1||input.length>250) throw new Error('1~250명의 명렬표를 등록해 주세요.');
 const seen=new Set<string>();
 return input.map((value,i)=>{
  if(!value||typeof value!=='object') throw new Error(`${i+1}번째 학생 정보를 확인해 주세요.`);
  const {classroom,student,name}=value;
  if(!Number.isInteger(classroom)||classroom<7||classroom>11) throw new Error(`${i+1}번째 학생: 반은 7~11반이어야 해요.`);
  if(!Number.isInteger(student)||student<1||student>50) throw new Error(`${i+1}번째 학생: 번호는 1~50번이어야 해요.`);
  if(typeof name!=='string'||!name.trim()||name.trim().length>40||/[\u0000-\u001f\u007f]/.test(name)) throw new Error(`${i+1}번째 학생: 이름을 확인해 주세요(1~40자).`);
  const key=`${classroom}-${student}`;
  if(seen.has(key)) throw new Error(`${classroom}반 ${student}번이 중복되어 있어요. 중복 행을 정리해 주세요.`);
  seen.add(key);return {classroom,student,name:name.trim()};
 });
}
export function parseDelimited(text:string):string[][] {
 const delimiter=text.includes('\t')?'\t':',';const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else if(quoted||cell==='')quoted=!quoted;else cell+=ch;}else if(ch===delimiter&&!quoted){row.push(cell);cell=''}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell=''}else cell+=ch;}
 if(quoted)throw new Error('따옴표가 닫히지 않은 셀이 있어요. 파일 내용을 확인해 주세요.');
 row.push(cell);rows.push(row);return rows;
}
export function parseRosterRows(values:unknown[][],defaultClass:number):Student[]{
 const rows=values.map(row=>row.map(v=>String(v??'').replace(/^\uFEFF/,'').trim())).filter(row=>row.some(Boolean));
 if(!rows.length)throw new Error('명렬표 내용을 먼저 넣어 주세요.');
 const norm=(v:string)=>v.replace(/\s/g,'');
 let header=-1,nameCol=-1,studentCol=-1,classCol=-1;
 for(let i=0;i<Math.min(rows.length,10);i++){const h=rows[i].map(norm);const n=h.findIndex(v=>['이름','성명','학생명'].includes(v));const s=h.findIndex(v=>['번호','출석번호','학생번호','번'].includes(v));if(n>=0&&s>=0){header=i;nameCol=n;studentCol=s;classCol=h.findIndex(v=>['반','학급'].includes(v));break}}
 const data=header>=0?rows.slice(header+1):rows;
 if(header<0){const count=rows[0].length;if(count!==2&&count!==3)throw new Error('열 제목을 반·번호·이름으로 지정하거나, 번호·이름 두 열을 넣어 주세요.');classCol=count===3?0:-1;studentCol=count===3?1:0;nameCol=count===3?2:1;}
 const numeric=(v:string|undefined,suffix:string)=>{const s=(v??'').replace(new RegExp(`${suffix}$`),'').trim();return /^\d+$/.test(s)?Number(s):NaN};
 return validateRoster(data.map(row=>({classroom:classCol<0?defaultClass:numeric(row[classCol],'반'),student:numeric(row[studentCol],'번'),name:row[nameCol]??''})));
}
