import { supabase } from '@/lib/supabase'
import HeroSection from '@/components/ui/HeroSection'
import ServicesGrid from '@/components/ui/ServicesGrid'
import ProjectsPreview from '@/components/ui/ProjectsPreview'
import WhySection from '@/components/ui/WhySection'
import CtaSection from '@/components/ui/CtaSection'

// Force fresh data on every visit
export const revalidate = 0;

async function getData() {
  // 1. Fetch Stats (Assuming you have a settings/stats table in Supabase)
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')

  const stats = {
    projects: settings?.find(s => s.key === 'stats-projects')?.value || '50+',
    clients: settings?.find(s => s.key === 'stats-clients')?.value || '40+',
    satisfaction: settings?.find(s => s.key === 'stats-satisfaction')?.value || '99%',
    experience: settings?.find(s => s.key === 'stats-experience')?.value || '5+',
  }

  // 2. Fetch Active Services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'active')
    .limit(6)

  // 3. Fetch ONLY Featured Projects for the Preview
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true) // This is the filter for your toggle!
    .limit(3)

  return {
    stats,
    services: services || [],
    projects: projects || []
  }
}

export default async function HomePage() {
  const { stats, services, projects } = await getData()

  return (
    <main className="bg-black min-h-screen">
      <HeroSection stats={stats} />
      <ServicesGrid services={services} />

      {/* This will now only show the 3 projects you toggled in Admin */}
      <ProjectsPreview projects={projects} />

      <WhySection />

    </main>
  )
}