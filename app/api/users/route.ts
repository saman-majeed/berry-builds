import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'

function auth(req: NextRequest) {
  return getSessionFromRequest(req) ? null : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  const e = auth(req); if (e) return e
  const db = getDb()
  const users = db.prepare('SELECT id, username, role, createdAt FROM users').all()
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const e = auth(req); if (e) return e
  const { username, password, role } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  const db = getDb()
  const exists = db.prepare('SELECT id FROM users WHERE username=?').get(username)
  if (exists) return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  const hash = bcrypt.hashSync(password, 10)
  const r = db.prepare('INSERT INTO users (username, password, role) VALUES (?,?,?)').run(username, hash, role || 'admin')
  return NextResponse.json({ success: true, id: r.lastInsertRowid })
}

export async function DELETE(req: NextRequest) {
  const e = auth(req); if (e) return e
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get('id'))
  const db = getDb()
  const user = db.prepare('SELECT username FROM users WHERE id=?').get(id) as any
  if (user?.username === 'admin') return NextResponse.json({ error: 'Cannot delete default admin' }, { status: 403 })
  db.prepare('DELETE FROM users WHERE id=?').run(id)
  return NextResponse.json({ success: true })
}
