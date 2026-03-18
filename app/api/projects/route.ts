import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { error } = await supabase.from('projects').insert([{
      name: body.name,
      category: body.category,
      tag: body.tag || '',
      image: body.image,
      url: body.url || '',
      description: body.description || '',
      status: body.status || 'Active',
      is_featured: body.is_featured || false, // ADDED: Save featured status
      customer_name: body.customer_name || '',
      customer_number: body.customer_number || '',
      customer_reviews: body.customer_reviews || ''
    }])
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const { error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
        category: updates.category,
        tag: updates.tag || '',
        image: updates.image,
        url: updates.url || '',
        description: updates.description || '',
        status: updates.status || 'Active',
        is_featured: updates.is_featured, // ADDED: Update featured status
        customer_name: updates.customer_name || '',
        customer_number: updates.customer_number || '',
        customer_reviews: updates.customer_reviews || ''
      })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const { error } = await supabase.from('projects').delete().eq('id', id)
  return NextResponse.json({ success: !error })
}