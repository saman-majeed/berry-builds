import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { current, newPassword } = await req.json()
  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(session.id) as any
  if (!user || !bcrypt.compareSync(current, user.password))
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  const hash = bcrypt.hashSync(newPassword, 10)
  db.prepare('UPDATE users SET password=? WHERE id=?').run(hash, session.id)
  return NextResponse.json({ success: true })
}
