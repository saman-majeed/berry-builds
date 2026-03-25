'use client' // Necessary for the search bar to function
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('category', { ascending: true })

      if (!error) setAllProjects(data || [])
      setLoading(false)
    }
    load()
  }, [])

  // Search Logic
  const filteredProjects = allProjects.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Grouping Logic
  const grouped = filteredProjects.reduce((acc: Record<string, any[]>, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  if (loading) return <div className="p-20 text-white text-center">Loading...</div>

  return (
    <div style={{ padding: '0 5% 80px', backgroundColor: 'black', minHeight: '100vh' }}>

      {/* 1. Added Spacer to prevent Navbar overlap */}
      <div style={{ height: '140px' }}></div>

      {/* 2. Your ORIGINAL Header Text */}
      <div style={{ textAlign: 'center', padding: '20px 0 50px' }}>
        <span style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Live Portfolio
        </span>
        <h1 style={{ fontSize: '2.8rem', color: 'white', margin: '10px 0', fontWeight: 800 }}>
          Featured Live Web Projects – Multi-Industry Portfolio
        </h1>
        <p style={{ color: '#71717a', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          {allProjects.length} A comprehensive collection of production-ready web applications spanning multiple industries including e-commerce, healthcare, fitness, education, legal services, and more. Each project showcases modern web development practices, responsive design, and industry-specific functionality.
        </p>

        {/* 3. Search Bar integrated into your theme */}
        <div style={{ maxWidth: '500px', margin: '30px auto 0' }}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#09090b',
              border: '1px solid #27272a',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              textAlign: 'center'
            }}
          />
        </div>
      </div>

      {/* 4. Your ORIGINAL Grouped Layout */}
      {Object.entries(grouped).map(([cat, projects]) => (
        <div key={cat} style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'white', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.5rem' }}>
            {cat}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map((p) => (
              <div key={p.id} style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                <Link href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ height: '180px', background: '#18181b', position: 'relative' }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🌐</div>
                    )}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '1.2rem' }}>{p.name}</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '10px' }}>
                      {p.description?.substring(0, 80)}...
                    </p>
                  </div>
                </Link>

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