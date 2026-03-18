import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

function auth(req: NextRequest) {
  return getSessionFromRequest(req) ? null : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  const e = auth(req); if (e) return e
  const db = getDb()
  const rows = db.prepare('SELECT * FROM settings').all() as { key: string; value: string }[]
  const obj: Record<string, string> = {}
  rows.forEach(r => { obj[r.key] = r.value })
  return NextResponse.json(obj)
}

export async function PUT(req: NextRequest) {
  const e = auth(req); if (e) return e
  const body = await req.json() as Record<string, string>
  const db = getDb()
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
  for (const [k, v] of Object.entries(body)) upsert.run(k, v)
  return NextResponse.json({ success: true })
}
