'use client'
import { useEffect, useState } from 'react'

const empty = { name:'', role:'', email:'', bio:'', status:'active' }

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({...empty})
  const [editId, setEditId] = useState<number|null>(null)
  const load = () => fetch('/api/team').then(r=>r.json()).then(setTeam)
  useEffect(()=>{load()},[])
  const set = (k:string,v:string)=>setForm(f=>({...f,[k]:v}))
  const openAdd=()=>{setForm({...empty});setEditId(null);setModal(true)}
  const openEdit=(m:any)=>{setForm({name:m.name,role:m.role||'',email:m.email||'',bio:m.bio||'',status:m.status});setEditId(m.id);setModal(true)}
  async function save(){
    if(!form.name) return alert('Name required')
    const body=editId?{...form,id:editId}:form
    await fetch('/api/team',{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    setModal(false);load()
  }
  async function del(id:number){if(!confirm('Remove member?'))return;await fetch(`/api/team?id=${id}`,{method:'DELETE'});load()}
  const inp:React.CSSProperties={width:'100%',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'7px',padding:'0.6rem 0.85rem',color:'var(--text)',fontSize:'0.87rem',outline:'none',fontFamily:'DM Sans, sans-serif'}
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.8rem'}}>
        <div><h1 style={{fontFamily:'Syne, sans-serif',fontSize:'1.4rem',color:'white'}}>Team</h1><p style={{color:'var(--muted)',fontSize:'0.83rem'}}>Manage your team members.</p></div>
        <button onClick={openAdd} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.5rem 1.1rem',borderRadius:'7px',fontWeight:600,fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>+ Add Member</button>
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'11px',overflow:'hidden'}}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {team.length===0?<tr><td colSpan={5} style={{padding:'2rem',textAlign:'center',color:'var(--muted)'}}>No team members yet. Add some!</td></tr>:
              team.map(m=>(
                <tr key={m.id}>
                  <td style={{color:'white',fontWeight:600}}>{m.name}</td>
                  <td>{m.role||'—'}</td><td>{m.email||'—'}</td>
                  <td><span style={{background:m.status==='active'?'rgba(16,185,129,.15)':'rgba(239,68,68,.15)',color:m.status==='active'?'#34d399':'#f87171',padding:'0.15rem 0.55rem',borderRadius:'5px',fontSize:'0.7rem',fontWeight:600}}>{m.status}</span></td>
                  <td><div style={{display:'flex',gap:'0.4rem'}}>
                    <button onClick={()=>openEdit(m)} style={{background:'var(--surface2)',color:'var(--text)',border:'1px solid var(--border)',padding:'0.25rem 0.6rem',borderRadius:'5px',fontSize:'0.72rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Edit</button>
                    <button onClick={()=>del(m.id)} style={{background:'rgba(239,68,68,.15)',color:'#f87171',border:'none',padding:'0.25rem 0.6rem',borderRadius:'5px',fontSize:'0.72rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Del</button>
                  </div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:900,padding:'1rem'}} onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'14px',width:'100%',maxWidth:'460px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.3rem 1.5rem',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'Syne, sans-serif',color:'white',fontSize:'1.05rem'}}>{editId?'Edit Member':'Add Member'}</h3>
              <button onClick={()=>setModal(false)} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'1.2rem',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{padding:'1.5rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.9rem',marginBottom:'0.9rem'}}>
                <div><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Name *</label><input style={inp} value={form.name} onChange={e=>set('name',e.target.value)}/></div>
                <div><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Role</label><input style={inp} value={form.role} onChange={e=>set('role',e.target.value)}/></div>
              </div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Email</label><input style={inp} value={form.email} onChange={e=>set('email',e.target.value)}/></div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Bio</label><textarea style={{...inp,minHeight:'80px',resize:'vertical'}} value={form.bio} onChange={e=>set('bio',e.target.value)}/></div>
              <div><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Status</label><select style={inp} value={form.status} onChange={e=>set('status',e.target.value)}><option>active</option><option>inactive</option></select></div>
            </div>
            <div style={{display:'flex',gap:'0.7rem',justifyContent:'flex-end',padding:'1rem 1.5rem',borderTop:'1px solid var(--border)'}}>
              <button onClick={save} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.5rem 1.1rem',borderRadius:'7px',fontWeight:600,fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Save</button>
              <button onClick={()=>setModal(false)} style={{background:'var(--surface2)',color:'var(--text)',border:'1px solid var(--border)',padding:'0.5rem 1.1rem',borderRadius:'7px',fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
