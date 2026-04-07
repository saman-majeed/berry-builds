import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, ...newData } = body

        const { data, error } = await supabase
            .from('projects')
            .insert([newData])
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data: data[0] })
    } catch (err) {
        return NextResponse.json({ error: 'Server connection failed' }, { status: 500 })
    }
}