'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const initialForm = {
  name: '',
  category: '',
  tag: '',
  image: '',
  url: '',
  description: '',
  status: 'Active',
  is_featured: false,
  customer_name: '',
  customer_number: '',
  customer_reviews: ''
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('') // ADDED: Search state
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState(initialForm)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const load = () => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load projects:", err))
  }

  useEffect(() => { load() }, [])

  // ADDED: Filter logic
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setForm({ ...form, image: reader.result as string })
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = form.image

      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, selectedFile)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      const method = editId ? 'PUT' : 'POST'
      const payload = editId ? { ...form, image: imageUrl, id: editId } : { ...form, image: imageUrl }

      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setModal(false)
        setEditId(null)
        setForm(initialForm)
        setSelectedFile(null)
        load()
      }
    } catch (err) {
      console.error(err)
      alert("Error saving project. Check console.")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (p: any) => {
    setForm({
      name: p.name || '',
      category: p.category || '',
      tag: p.tag || '',
      image: p.image || '',
      url: p.url || '',
      description: p.description || '',
      status: p.status || 'Active',
      is_featured: p.is_featured || false,
      customer_name: p.customer_name || '',
      customer_number: p.customer_number || '',
      customer_reviews: p.customer_reviews || ''
    })
    setEditId(p.id)
    setModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      if (res.ok) load()
    }
  }

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-zinc-500 text-sm">Efficient portfolio management</p>
        </div>
        <button
          onClick={() => { setEditId(null); setForm(initialForm); setModal(true) }}
          className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20"
        >
          + Add New Project
        </button>
      </div>

      {/* ADDED: ADMIN SEARCH BAR */}
      <div className="mb-10 max-w-md">
        <input
          type="text"
          placeholder="Search projects by name or category..."
          className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm focus:border-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {filteredProjects.map((p) => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl group relative overflow-hidden">
            <div className="relative h-40 w-full mb-4">
              <img src={p.image || '/logo.png'} className="w-full h-full object-cover rounded-lg" alt="" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-white/10">
                {p.status}
              </div>
              {p.is_featured && (
                <div className="absolute top-2 left-2 bg-blue-600 text-[10px] px-2 py-1 rounded font-bold uppercase">Featured</div>
              )}
            </div>
            <h2 className="font-bold truncate">{p.name}</h2>
            <p className="text-zinc-500 text-sm mb-4">{p.category}</p>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button onClick={() => startEdit(p)} className="flex-1 bg-zinc-800 py-2 rounded-lg text-sm hover:bg-zinc-700">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-900/20 text-red-500 py-2 rounded-lg text-sm hover:bg-red-900/40">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-2xl w-full max-w-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editId ? 'Edit' : 'Add'} Project</h2>
              <button type="button" onClick={() => setModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-600/30 rounded-xl">
                <input
                  type="checkbox"
                  id="is_featured"
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                <label htmlFor="is_featured" className="text-sm font-bold text-blue-400 cursor-pointer uppercase tracking-tighter">
                  Feature this project on Home Page preview
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase mb-1 block font-bold">Project Name</label>
                  <input type="text" placeholder="Project Name" value={form.name} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase mb-1 block font-bold">Category</label>
                  <input type="text" placeholder="E-commerce" value={form.category} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setForm({ ...form, category: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase mb-1 block font-bold">Tag</label>
                  <input type="text" placeholder="Next.js" value={form.tag} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setForm({ ...form, tag: e.target.value })} />
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase mb-1 block font-bold">Status</label>
                  <select value={form.status} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none appearance-none" onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase mb-1 block font-bold">Live URL</label>
                  <input type="text" placeholder="https://..." value={form.url} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setForm({ ...form, url: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-zinc-500 text-[10px] uppercase mb-1 block font-bold">Project Description</label>
                <textarea placeholder="Description" value={form.description} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white h-24 focus:border-blue-500 outline-none resize-none" onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-blue-400 text-xs font-bold mb-4 uppercase tracking-widest">Client Testimonial Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="Client Name" value={form.customer_name} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none" onChange={e => setForm({ ...form, customer_name: e.target.value })} />
                  <input type="text" placeholder="Client Number" value={form.customer_number} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none" onChange={e => setForm({ ...form, customer_number: e.target.value })} />
                </div>
                <textarea placeholder="Client Review" value={form.customer_reviews} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white h-20 outline-none resize-none" onChange={e => setForm({ ...form, customer_reviews: e.target.value })} />
              </div>

              <div>
                <label className="text-zinc-500 text-[10px] uppercase mb-1 block font-bold">Featured Image</label>
                <input type="file" className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700" onChange={handleImage} accept="image/*" />
                {form.image && <img src={form.image} className="mt-4 h-32 rounded-lg border border-zinc-800" alt="Preview" />}
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-blue-900 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : editId ? 'Update Project' : 'Create Project'}
              </button>
              <button type="button" onClick={() => setModal(false)} className="flex-1 bg-zinc-800 py-3 rounded-xl text-zinc-400 hover:bg-zinc-700 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}