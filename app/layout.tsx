import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'레이저 사격 클래스 | 1학년 7~11반', description:'안전하게 배우고, 나의 기록에 도전하는 레이저 사격 수업', icons:{icon:'/favicon.svg'} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
