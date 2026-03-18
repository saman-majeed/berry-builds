'use client'
import { useEffect, useState } from 'react'

const cats = ['Development Services','AI & Data Services','Creative & Marketing','Enterprise Solutions']
const empty = { name:'', icon:'🔧', category:'Development Services', shortDesc:'', description:'', stack:'', deliverables:'', status:'active' }

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ ...empty })
  const [editId, setEditId] = useState<number|null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => fetch('/api/services').then(r=>r.json()).then(d=>{setServices(d);setLoading(false)})
  useEffect(()=>{load()},[])
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}))
  const openAdd = () => {setForm({...empty});setEditId(null);setModal(true)}
  const openEdit = (s:any) => {setForm({name:s.name,icon:s.icon||'🔧',category:s.category,shortDesc:s.shortDesc||'',description:s.description||'',stack:s.stack||'',deliverables:s.deliverables||'',status:s.status});setEditId(s.id);setModal(true)}
  async function save() {
    if(!form.name) return alert('Name is required')
    const body = editId ? {...form,id:editId} : form
    await fetch('/api/services',{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    setModal(false);load()
  }
  async function del(id:number) {
    if(!confirm('Delete this service?')) return
    await fetch(`/api/services?id=${id}`,{method:'DELETE'});load()
  }
  const inp:React.CSSProperties = {width:'100%',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'7px',padding:'0.6rem 0.85rem',color:'var(--text)',fontSize:'0.87rem',outline:'none',fontFamily:'DM Sans, sans-serif'}

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.8rem',flexWrap:'wrap',gap:'1rem'}}>
        <div>
          <h1 style={{fontFamily:'Syne, sans-serif',fontSize:'1.4rem',color:'white'}}>Services</h1>
          <p style={{color:'var(--muted)',fontSize:'0.83rem'}}>Manage the services you offer.</p>
        </div>
        <button onClick={openAdd} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.5rem 1.1rem',borderRadius:'7px',fontWeight:600,fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>+ Add Service</button>
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'11px',overflow:'hidden'}}>
        <div style={{padding:'1rem 1.3rem',borderBottom:'1px solid var(--border)'}}>
          <h3 style={{fontFamily:'Syne, sans-serif',fontSize:'1rem',color:'white'}}>{services.length} Services</h3>
        </div>
        {loading ? <p style={{padding:'2rem',color:'var(--muted)',textAlign:'center'}}>Loading...</p> : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Category</th><th>Icon</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map(s=>(
                <tr key={s.id}>
                  <td style={{color:'white',fontWeight:600}}>{s.name}</td>
                  <td>{s.category}</td>
                  <td style={{fontSize:'1.2rem'}}>{s.icon}</td>
                  <td><span style={{background:s.status==='active'?'rgba(16,185,129,.15)':'rgba(239,68,68,.15)',color:s.status==='active'?'#34d399':'#f87171',padding:'0.15rem 0.55rem',borderRadius:'5px',fontSize:'0.7rem',fontWeight:600}}>{s.status}</span></td>
                  <td><div style={{display:'flex',gap:'0.4rem'}}>
                    <button onClick={()=>openEdit(s)} style={{background:'var(--surface2)',color:'var(--text)',border:'1px solid var(--border)',padding:'0.25rem 0.6rem',borderRadius:'5px',fontSize:'0.72rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Edit</button>
                    <button onClick={()=>del(s.id)} style={{background:'rgba(239,68,68,.15)',color:'#f87171',border:'none',padding:'0.25rem 0.6rem',borderRadius:'5px',fontSize:'0.72rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Del</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:900,padding:'1rem'}} onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'14px',width:'100%',maxWidth:'520px',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.3rem 1.5rem',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'Syne, sans-serif',color:'white',fontSize:'1.05rem'}}>{editId?'Edit Service':'Add Service'}</h3>
              <button onClick={()=>setModal(false)} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'1.2rem',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{padding:'1.5rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem',marginBottom:'0.9rem'}}>
                <div><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Name *</label><input style={inp} value={form.name} onChange={e=>set('name',e.target.value)}/></div>
                <div><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Icon Emoji</label><input style={inp} value={form.icon} onChange={e=>set('icon',e.target.value)}/></div>
              </div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Category</label><select style={inp} value={form.category} onChange={e=>set('category',e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Short Description</label><input style={inp} value={form.shortDesc} onChange={e=>set('shortDesc',e.target.value)}/></div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Full Description</label><textarea style={{...inp,minHeight:'80px',resize:'vertical'}} value={form.description} onChange={e=>set('description',e.target.value)}/></div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Tech Stack (comma separated)</label><input style={inp} value={form.stack} onChange={e=>set('stack',e.target.value)} placeholder="Next.js, React, TypeScript"/></div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Deliverables (one per line)</label><textarea style={{...inp,minHeight:'80px',resize:'vertical'}} value={form.deliverables} onChange={e=>set('deliverables',e.target.value)}/></div>
              <div><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Status</label><select style={inp} value={form.status} onChange={e=>set('status',e.target.value)}><option>active</option><option>inactive</option></select></div>
            </div>
            <div style={{display:'flex',gap:'0.7rem',justifyContent:'flex-end',padding:'1rem 1.5rem',borderTop:'1px solid var(--border)'}}>
              <button onClick={save} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.5rem 1.1rem',borderRadius:'7px',fontWeight:600,fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Save Service</button>
              <button onClick={()=>setModal(false)} style={{background:'var(--surface2)',color:'var(--text)',border:'1px solid var(--border)',padding:'0.5rem 1.1rem',borderRadius:'7px',fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
