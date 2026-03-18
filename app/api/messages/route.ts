import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

function requireAuth(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET(req: NextRequest) {
  const authError = requireAuth(req)
  if (authError) return authError
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const db = getDb()
  const msgs = status && status !== 'all'
    ? db.prepare('SELECT * FROM messages WHERE status=? ORDER BY createdAt DESC').all(status)
    : db.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all()
  return NextResponse.json(msgs)
}

export async function PATCH(req: NextRequest) {
  const authError = requireAuth(req)
  if (authError) return authError
  const { id, status } = await req.json()
  const db = getDb()
  db.prepare('UPDATE messages SET status=? WHERE id=?').run(status, id)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const authError = requireAuth(req)
  if (authError) return authError
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const db = getDb()
  if (id) {
    db.prepare('DELETE FROM messages WHERE id=?').run(Number(id))
  } else {
    db.prepare('DELETE FROM messages').run()
  }
  return NextResponse.json({ success: true })
}
