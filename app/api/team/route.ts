import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

function auth(req: NextRequest) {
  return getSessionFromRequest(req) ? null : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  const e = auth(req); if (e) return e
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM team ORDER BY name').all())
}

export async function POST(req: NextRequest) {
  const e = auth(req); if (e) return e
  const b = await req.json()
  const db = getDb()
  const r = db.prepare('INSERT INTO team (name,role,email,bio,status) VALUES (?,?,?,?,?)').run(b.name,b.role||'',b.email||'',b.bio||'',b.status||'active')
  return NextResponse.json({ success: true, id: r.lastInsertRowid })
}

export async function PUT(req: NextRequest) {
  const e = auth(req); if (e) return e
  const b = await req.json()
  const db = getDb()
  db.prepare('UPDATE team SET name=?,role=?,email=?,bio=?,status=? WHERE id=?').run(b.name,b.role||'',b.email||'',b.bio||'',b.status||'active',b.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const e = auth(req); if (e) return e
  const { searchParams } = new URL(req.url)
  const db = getDb()
  db.prepare('DELETE FROM team WHERE id=?').run(Number(searchParams.get('id')))
  return NextResponse.json({ success: true })
}
