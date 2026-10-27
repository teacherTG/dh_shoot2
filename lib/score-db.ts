import { env } from 'cloudflare:workers';
export function scoreDb() { if (!env.DB) throw new Error('Database unavailable'); return env.DB; }
