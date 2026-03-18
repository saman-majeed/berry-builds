import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 0;

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !project) {
        return notFound();
    }

    return (
        <div style={{ background: 'black', minHeight: '100vh', color: 'white', padding: '80px 5%' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Link href="/projects" style={{ color: '#3b82f6', textDecoration: 'none', display: 'inline-block', marginBottom: '40px' }}>
                    ← Back
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px' }}>

                    {/* Main Project Image */}
                    <div style={{ border: '1px solid #27272a', borderRadius: '20px', overflow: 'hidden', background: '#09090b' }}>
                        <img
                            src={project.image}
                            alt={project.name}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>

                    {/* Details Section */}
                    <div>
                        <span style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                            {project.category} {project.tag && `| ${project.tag}`}
                        </span>

                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '15px 0', lineHeight: 1.1 }}>
                            {project.name}
                        </h1>

                        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '40px' }}>
                            {project.description}
                        </p>

                        {/* Client Review Section */}
                        {project.customer_reviews && (
                            <div style={{ background: '#09090b', padding: '30px', borderRadius: '16px', border: '1px solid #27272a', marginBottom: '40px' }}>
                                <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '0.05em' }}>
                                    Client Experience
                                </h4>
                                <p style={{ fontStyle: 'italic', fontSize: '1.05rem', marginBottom: '20px', color: '#e4e4e7' }}>
                                    "{project.customer_reviews}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#1d4ed8' }}></div>
                                    <span style={{ fontWeight: 600 }}>{project.customer_name || 'Verified Client'}</span>
                                </div>
                            </div>
                        )}

                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                background: '#3b82f6',
                                color: 'white',
                                padding: '16px 40px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: '0.2s opacity'
                            }}
                        >
                            View Project Live ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}