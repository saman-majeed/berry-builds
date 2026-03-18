import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase.from('services').insert([body]).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data: data[0] })
}

export async function DELETE(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}