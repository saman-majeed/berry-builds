import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import data from '../../../berrybuilds-data.json'

export async function GET() {
    try {
        // .upsert() is safer than .insert() for migrations
        const { error: pError } = await supabase.from('projects').upsert(data.projects)
        if (pError) throw new Error(`Projects: ${pError.message}`)

        const { error: sError } = await supabase.from('services').upsert(data.services)
        if (sError) throw new Error(`Services: ${sError.message}`)

        return NextResponse.json({
            success: true,
            message: "Sync Complete!",
            projects: data.projects.length,
            services: data.services.length
        })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}