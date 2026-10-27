/** Google Sheets backend. Secrets live only in Script Properties. */
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SPREADSHEET_ID')) throw new Error('프로젝트 설정에서 SPREADSHEET_ID를 설정하세요.');
  if (!props.getProperty('CLASS_CODE')) props.setProperty('CLASS_CODE', Utilities.getUuid().replace(/-/g, '').slice(0, 16));
  const book = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
  if (!book.getSheetByName('기록') || !book.getSheetByName('명렬표')) throw new Error('기록과 명렬표 시트를 확인하세요.');
  console.log('수업 코드: ' + props.getProperty('CLASS_CODE'));
  console.log('연결 완료: ' + book.getName());
}

function doGet() { return json_({ok:true, service:'laser-class-sheets', version:1}); }
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function doPost(e) {
  let lock;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 60000) throw new Error('요청 크기를 확인해 주세요.');
    const request = JSON.parse(raw);
    const props = PropertiesService.getScriptProperties();
    const code = props.getProperty('CLASS_CODE');
    if (!code || typeof request.code !== 'string' || request.code !== code) return json_({ok:false,status:401,error:'수업 코드가 올바르지 않아요.'});
    if (!['scores.list','scores.save','roster.list','roster.save'].includes(request.action)) throw new Error('지원하지 않는 요청입니다.');
    lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return json_({ok:false,status:503,error:'다른 기록을 저장 중이에요. 잠시 후 다시 시도해 주세요.'});
    const book = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
    const roster = book.getSheetByName('명렬표');
    const scores = book.getSheetByName('기록');
    const students = rows_(roster,3).map(r=>({classroom:Number(r[0]),student:Number(r[1]),name:String(r[2])}));
    if (request.action === 'roster.list') return json_({ok:true,students:sort_(students)});
    const payload = request.payload || {};
    if (request.action === 'roster.save') {
      const incoming = payload.students;
      if (!Array.isArray(incoming) || !incoming.length || incoming.length > 250) throw new Error('1~250명의 명렬표를 입력해 주세요.');
      const keys = new Set();
      incoming.forEach(s=>{
        identity_(s);
        if (typeof s.name !== 'string' || !s.name.trim() || s.name.trim().length > 40 || /[\u0000-\u001f\u007f]/.test(s.name)) throw new Error('이름을 확인해 주세요.');
        const key = s.classroom+'-'+s.student;
        if (keys.has(key)) throw new Error('반과 번호가 중복됩니다.');
        keys.add(key);
      });
      const merged = new Map(students.map(s=>[s.classroom+'-'+s.student,s]));
      incoming.forEach(s=>merged.set(s.classroom+'-'+s.student,{classroom:s.classroom,student:s.student,name:s.name.trim()}));
      const values = sort_(Array.from(merged.values())).map(s=>[s.classroom,s.student,"'"+s.name]);
      roster.getRange(2,1,values.length,3).setValues(values);
      SpreadsheetApp.flush();
      return json_({ok:true,saved:incoming.length});
    }
    const existing = rows_(scores,5);
    if (request.action === 'scores.save') {
      identity_(payload);
      if (!Number.isInteger(payload.score) || payload.score < 0 || payload.score > 100) throw new Error('점수는 0~100 사이의 정수로 입력해 주세요.');
      if (typeof payload.id !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(payload.id)) throw new Error('기록 번호가 올바르지 않습니다.');
      const prior = existing.find(r=>r[0]===payload.id);
      if (prior && (Number(prior[1])!==payload.classroom || Number(prior[2])!==payload.student || Number(prior[3])!==payload.score)) throw new Error('기록 번호가 중복되었습니다. 입력창을 다시 열어 주세요.');
      if (!prior) {
        const row=[payload.id,payload.classroom,payload.student,payload.score,new Date().toISOString()];
        scores.appendRow(row); existing.push(row); SpreadsheetApp.flush();
      }
    }
    const names = new Map(students.map(s=>[s.classroom+'-'+s.student,s.name]));
    const records=existing.map(r=>({id:String(r[0]),classroom:Number(r[1]),student:Number(r[2]),score:Number(r[3]),createdAt:r[4] instanceof Date?r[4].toISOString():String(r[4]),name:names.get(r[1]+'-'+r[2])||null})).reverse();
    return json_({ok:true,records});
  } catch(error) { return json_({ok:false,status:400,error:error instanceof SyntaxError?'요청 형식이 올바르지 않아요.':String(error.message||'저장하지 못했어요.')}); }
  finally { if(lock && lock.hasLock()) lock.releaseLock(); }
}
function rows_(sheet,width){if(!sheet)throw new Error('저장 시트를 찾지 못했어요.');return sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,width).getValues():[];}
function sort_(students){return students.sort((a,b)=>a.classroom-b.classroom||a.student-b.student);}
function identity_(s){if(!s||!Number.isInteger(s.classroom)||s.classroom<7||s.classroom>11||!Number.isInteger(s.student)||s.student<1||s.student>50)throw new Error('반은 7~11반, 번호는 1~50번으로 입력해 주세요.');}
