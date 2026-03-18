import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import data from '@/berrybuilds-data.json' // Make sure the path to your JSON is correct

export async function GET() {
    // 1. Import Projects
    const { error: pError } = await supabase.from('projects').insert(data.projects)

    // 2. Import Services
    const { error: sError } = await supabase.from('services').insert(data.services)

    if (pError || sError) {
        return NextResponse.json({ error: pError?.message || sError?.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Successfully imported all data to Supabase!" })
}