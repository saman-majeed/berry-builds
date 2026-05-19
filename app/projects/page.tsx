'use client' // Necessary for the search bar to function
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Your Supabase Storage Base URL
const STORAGE_URL = "https://ngxjiihozulpdwjdyzro.supabase.co/storage/v1/object/public/project-images/";

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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-[5%] py-28 text-muted">
        <span className="animate-pulse font-medium text-text">Loading projects…</span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen px-[5%] pb-24 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[15%] top-32 h-48 w-48 rounded-full bg-accent/25 blur-[100px]"
      />

      <div className="relative mx-auto max-w-[1100px] text-center">
        <span className="section-label">Live Portfolio</span>
        <h1 className="mt-8 font-syne text-[clamp(1.85rem,4vw,2.65rem)] font-extrabold leading-tight tracking-tight text-white">
          Featured Live Web Projects – Multi-Industry Portfolio
        </h1>
        <p className="mx-auto mt-6 max-w-[800px] leading-relaxed text-muted">
          {allProjects.length} production-ready builds across ecommerce, healthcare, fitness, education, legal, and more
          — each focused on responsive design, accessibility, and real business workflows.
        </p>

        <div className="mx-auto mt-10 max-w-md">
          <input
            type="search"
            placeholder="Search by name or category…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface2/80 px-5 py-3.5 text-center text-text shadow-inner ring-1 ring-white/[0.04] backdrop-blur-sm transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-accent2/50 focus:outline-none focus:ring-2 focus:ring-accent/25"
          />
        </div>
      </div>

      <div className="relative mx-auto mt-14 max-w-[1200px]">
        {Object.entries(grouped).map(([cat, projects]) => (
          <div key={cat} className="mb-16">
            <h2 className="mb-6 border-b border-border pb-3 font-syne text-xl font-bold text-white">{cat}</h2>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="hover-lift-card flex flex-col overflow-hidden rounded-2xl border border-border bg-surface2/80 shadow-lg ring-1 ring-white/[0.04]"
                >
                  <Link href={`/projects/${p.id}`} className="block flex-1 no-underline">
                    <div className="relative h-48 overflow-hidden bg-surface3">
                      {/* Robust verification checking if string contains a standard image suffix or an absolute web reference */}
                      {p.image && (p.image.includes('.') || p.image.startsWith('http')) ? (
                        <img
                          src={p.image.startsWith('http') ? p.image : `${STORAGE_URL}${p.image}`}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                          onError={(e) => {
                            // Automatically switches back to fallback state if standard request goes invalid
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Missing+Asset';
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl">
                          {p.image || "🌐"}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-syne text-lg font-bold text-white">{p.name}</h3>
                      <p className="mt-2 line-clamp-2 text-[0.9rem] text-muted">
                        {p.description?.substring(0, 100)}
                        {p.description && p.description.length > 100 ? '…' : ''}
                      </p>
                    </div>
                  </Link>

                  <div className="mt-auto border-t border-border px-6 py-4">
                    <Link
                      href={p.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-accent2 no-underline transition-colors hover:text-accent3"
                    >
                      View Live Site ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}