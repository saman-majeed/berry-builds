'use client'
import { useEffect, useState } from 'react'

export default function StatsPage() {
  const [vals, setVals] = useState({ 'stats-projects':'50+','stats-clients':'40+','stats-satisfaction':'99%','stats-experience':'5+' })
  const [saved, setSaved] = useState(false)
  useEffect(()=>{fetch('/api/settings').then(r=>r.json()).then(d=>setVals(v=>({...v,...Object.fromKeysByPrefixFilter(d,'stats-')})))}, [])
  function fromKeysByPrefixFilter(obj:any, prefix:string){ const r:any={}; for(const k in obj) if(k.startsWith(prefix)) r[k]=obj[k]; return r }
  async function save(){
    await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(vals)})
    setSaved(true); setTimeout(()=>setSaved(false),2500)
  }
  const inp:React.CSSProperties={width:'100%',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'7px',padding:'0.65rem 0.9rem',color:'var(--text)',fontSize:'0.88rem',outline:'none',fontFamily:'DM Sans, sans-serif'}
  return (
    <div>
      <div style={{marginBottom:'1.8rem'}}>
        <h1 style={{fontFamily:'Syne, sans-serif',fontSize:'1.4rem',color:'white'}}>Site Statistics</h1>
        <p style={{color:'var(--muted)',fontSize:'0.83rem'}}>Edit the stats shown on the homepage hero section.</p>
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'11px',padding:'1.8rem',maxWidth:'500px'}}>
        {[['stats-projects','Projects Delivered (e.g. "50+")'],['stats-clients','Happy Clients (e.g. "40+")'],['stats-satisfaction','Client Satisfaction (e.g. "99%")'],['stats-experience','Years Experience (e.g. "5+")']].map(([k,label])=>(
          <div key={k} style={{marginBottom:'1rem'}}>
            <label style={{display:'block',color:'var(--muted)',fontSize:'0.78rem',fontWeight:500,marginBottom:'0.4rem'}}>{label}</label>
            <input style={inp} value={vals[k as keyof typeof vals]||''} onChange={e=>setVals(v=>({...v,[k]:e.target.value}))}/>
          </div>
        ))}
        <button onClick={save} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.65rem 1.5rem',borderRadius:'8px',fontWeight:600,fontSize:'0.9rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>
          {saved ? '✅ Saved!' : 'Save & Update Homepage'}
        </button>
      </div>
    </div>
  )
}
