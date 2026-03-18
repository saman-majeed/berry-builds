import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects – BerryBuilds Portfolio',
  description: 'Production-ready web applications across multiple industries.',
}

export const revalidate = 0;

export default async function ProjectsPage() {
  const { data: allProjects, error } = await supabase
    .from('projects')
    .select('*')
    .order('category', { ascending: true })

  if (error || !allProjects) {
    console.error("Supabase Error:", error)
    return <div className="p-20 text-white text-center">No projects found in the cloud.</div>
  }

  const grouped = allProjects.reduce((acc: Record<string, any[]>, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <div style={{ padding: '60px 5% 80px', backgroundColor: 'black', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <span style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Live Portfolio
        </span>
        <h1 style={{ fontSize: '3rem', color: 'white', margin: '10px 0' }}>Featured Live Web Projects – Multi-Industry Portfolio</h1>
        <p style={{ color: '#71717a' }}>{allProjects.length}
          A comprehensive collection of production-ready web applications spanning multiple industries including e-commerce, healthcare, fitness, education, legal services, and more. Each project showcases modern web development practices, responsive design, and industry-specific functionality.</p>
      </div>

      {Object.entries(grouped).map(([cat, projects]) => (
        <div key={cat} style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'white', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginBottom: '20px' }}>
            {cat}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map((p) => (
              <div key={p.id} style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Clickable Image and Title linked to DETAIL PAGE */}
                <Link href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ height: '180px', background: '#18181b', position: 'relative' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🌐</div>
                    )}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ color: 'white', marginBottom: '10px' }}>{p.name}</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '10px' }}>
                      {p.description?.substring(0, 80)}...
                    </p>
                  </div>
                </Link>

                {/* External Link */}
                <div style={{ padding: '0 20px 20px' }}>
                  <Link href={p.url || '#'} target="_blank" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none', fontSize: '0.8rem' }}>
                    View Live Site ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}