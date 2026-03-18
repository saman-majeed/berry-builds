import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE username=?').get(username) as any
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const token = signToken({ id: user.id, username: user.username, role: user.role })

  const res = NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } })
  res.cookies.set('bb-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
