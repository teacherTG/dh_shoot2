import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import Home from '../app/page';
import {configureClassApi,classFetch} from '../lib/class-api';
import '../app/globals.css';
const endpoint = 'https://script.google.com/macros/s/AKfycbxrKZqcjxAbzM-c8wAgrsPWlVdVnQkKlpBm9YxGKs67yjmN1oo05_WO_wnZo5FgP1QA/exec';
function Entry(){
 const [ready,setReady]=useState(false),[code,setCode]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function enter(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{configureClassApi(endpoint,code.trim());const response=await classFetch('/api/roster');const data=await response.json() as {error?:string};if(!response.ok)throw new Error(data.error);setReady(true)}catch(e){setError(e instanceof Error?e.message:'연결을 확인해 주세요.')}finally{setBusy(false)}}
 if(ready)return <><Home/><div style={{textAlign:'center',padding:24}}><button onClick={()=>{configureClassApi(endpoint,'');setCode('');setReady(false)}}>수업 나가기</button><p className="muted">기록과 명렬표는 선생님의 구글시트에 저장돼요.</p></div></>;
 return <div className="shell" style={{maxWidth:580,paddingTop:'10vh'}}><section className="roster-card"><span className="eyebrow">LASER SHOOTING CLASS</span><h1>레이저 사격 클래스</h1><p>1학년 2학기 · 7–11반</p><form onSubmit={enter}><label>수업 코드<input autoComplete="off" type="password" required value={code} onChange={e=>setCode(e.target.value)} placeholder="선생님이 알려 준 코드"/></label><p className="muted">학생 이름과 기록을 보호하기 위해 수업 코드를 확인해요.</p>{error&&<p role="alert" className="form-error">{error}</p>}<button className="primary save" disabled={busy}>{busy?'연결 확인 중…':'수업 시작하기'}</button></form></section></div>;
}
createRoot(document.getElementById('root')!).render(<Entry/>);
