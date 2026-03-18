import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, service, details } = body
    if (!firstName || !email || !service || !details)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const db = getDb()
    const result = db.prepare(`
      INSERT INTO messages (firstName, lastName, email, phone, company, service, budget, details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `).run(firstName, lastName || '', email, body.phone || '', body.company || '', service, body.budget || '', details)

    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const db = getDb()
  const msgs = status && status !== 'all'
    ? db.prepare('SELECT * FROM messages WHERE status = ? ORDER BY createdAt DESC').all(status)
    : db.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all()
  return NextResponse.json(msgs)
}
