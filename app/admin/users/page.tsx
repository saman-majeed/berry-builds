'use client'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ username:'', password:'', role:'admin' })
  const [error, setError] = useState('')
  const load = () => fetch('/api/users').then(r=>r.json()).then(setUsers)
  useEffect(()=>{load()},[])
  const set = (k:string,v:string)=>setForm(f=>({...f,[k]:v}))
  async function save(){
    if(!form.username||!form.password){setError('Username and password required');return}
    const res=await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const d=await res.json()
    if(!res.ok){setError(d.error||'Error');return}
    setModal(false);setForm({username:'',password:'',role:'admin'});setError('');load()
  }
  async function del(id:number){if(!confirm('Remove this user?'))return;await fetch(`/api/users?id=${id}`,{method:'DELETE'});load()}
  const inp:React.CSSProperties={width:'100%',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'7px',padding:'0.6rem 0.85rem',color:'var(--text)',fontSize:'0.87rem',outline:'none',fontFamily:'DM Sans, sans-serif'}
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.8rem'}}>
        <div><h1 style={{fontFamily:'Syne, sans-serif',fontSize:'1.4rem',color:'white'}}>Admin Users</h1><p style={{color:'var(--muted)',fontSize:'0.83rem'}}>Manage admin accounts and access.</p></div>
        <button onClick={()=>{setModal(true);setError('')}} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.5rem 1.1rem',borderRadius:'7px',fontWeight:600,fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>+ Add User</button>
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'11px',overflow:'hidden'}}>
        <table className="data-table">
          <thead><tr><th>Username</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}>
                <td style={{color:'white',fontWeight:600}}>{u.username}</td>
                <td><span style={{background:'rgba(109,40,217,.15)',color:'var(--accent3)',padding:'0.15rem 0.55rem',borderRadius:'5px',fontSize:'0.7rem',fontWeight:600}}>{u.role}</span></td>
                <td>{u.createdAt?new Date(u.createdAt).toLocaleDateString():'—'}</td>
                <td>{u.username==='admin'?<span style={{color:'var(--muted)',fontSize:'0.75rem'}}>Protected</span>:
                  <button onClick={()=>del(u.id)} style={{background:'rgba(239,68,68,.15)',color:'#f87171',border:'none',padding:'0.25rem 0.6rem',borderRadius:'5px',fontSize:'0.72rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Remove</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:900,padding:'1rem'}} onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'14px',width:'100%',maxWidth:'400px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.3rem 1.5rem',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'Syne, sans-serif',color:'white',fontSize:'1.05rem'}}>Add Admin User</h3>
              <button onClick={()=>setModal(false)} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'1.2rem',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{padding:'1.5rem'}}>
              {error&&<div style={{color:'#f87171',fontSize:'0.82rem',background:'rgba(239,68,68,.1)',padding:'0.6rem',borderRadius:'6px',marginBottom:'0.9rem'}}>{error}</div>}
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Username *</label><input style={inp} value={form.username} onChange={e=>set('username',e.target.value)}/></div>
              <div style={{marginBottom:'0.9rem'}}><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Password *</label><input type="password" style={inp} value={form.password} onChange={e=>set('password',e.target.value)}/></div>
              <div><label style={{display:'block',color:'var(--muted)',fontSize:'0.77rem',marginBottom:'0.35rem'}}>Role</label><select style={inp} value={form.role} onChange={e=>set('role',e.target.value)}><option>admin</option><option>editor</option></select></div>
            </div>
            <div style={{display:'flex',gap:'0.7rem',justifyContent:'flex-end',padding:'1rem 1.5rem',borderTop:'1px solid var(--border)'}}>
              <button onClick={save} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.5rem 1.1rem',borderRadius:'7px',fontWeight:600,fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Add User</button>
              <button onClick={()=>setModal(false)} style={{background:'var(--surface2)',color:'var(--text)',border:'1px solid var(--border)',padding:'0.5rem 1.1rem',borderRadius:'7px',fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
