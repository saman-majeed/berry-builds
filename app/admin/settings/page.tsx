'use client'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string,string>>({})
  const [pw, setPw] = useState({ current:'', next:'', confirm:'' })
  const [msg, setMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  useEffect(()=>{ fetch('/api/settings').then(r=>r.json()).then(setSettings) },[])
  const set = (k:string,v:string)=>setSettings(s=>({...s,[k]:v}))

  async function save(){
    await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(settings)})
    setMsg('✅ Settings saved!'); setTimeout(()=>setMsg(''),2500)
  }

  async function changePassword(){
    if(!pw.current||!pw.next||!pw.confirm){setPwMsg('Fill all fields');return}
    if(pw.next!==pw.confirm){setPwMsg('Passwords do not match');return}
    const res=await fetch('/api/users/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({current:pw.current,newPassword:pw.next})})
    const d=await res.json()
    if(res.ok){setPwMsg('✅ Password updated!');setPw({current:'',next:'',confirm:''})}
    else setPwMsg(d.error||'Error')
    setTimeout(()=>setPwMsg(''),3000)
  }

  const inp:React.CSSProperties={width:'100%',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'7px',padding:'0.65rem 0.9rem',color:'var(--text)',fontSize:'0.88rem',outline:'none',fontFamily:'DM Sans, sans-serif'}
  const card=(children:React.ReactNode,title:string)=>(
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'11px',padding:'1.5rem'}}>
      <h3 style={{fontFamily:'Syne, sans-serif',color:'white',fontSize:'1rem',marginBottom:'1.2rem',paddingBottom:'0.7rem',borderBottom:'1px solid var(--border)'}}>{title}</h3>
      {children}
    </div>
  )

  return (
    <div>
      <div style={{marginBottom:'1.8rem'}}>
        <h1 style={{fontFamily:'Syne, sans-serif',fontSize:'1.4rem',color:'white'}}>Settings</h1>
        <p style={{color:'var(--muted)',fontSize:'0.83rem'}}>Configure your website settings.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.2rem'}}>
        {card(
          <>
            {[['site-name','Site Name'],['site-tagline','Tagline'],['contact-email','Contact Email'],['phone','Phone'],['address','Address']].map(([k,label])=>(
              <div key={k} style={{marginBottom:'0.9rem'}}>
                <label style={{display:'block',color:'var(--muted)',fontSize:'0.78rem',fontWeight:500,marginBottom:'0.4rem'}}>{label}</label>
                <input style={inp} value={settings[k]||''} onChange={e=>set(k,e.target.value)}/>
              </div>
            ))}
            <button onClick={save} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.6rem 1.3rem',borderRadius:'7px',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>{msg||'Save Settings'}</button>
          </>,
          'Site Configuration'
        )}
        {card(
          <>
            <div style={{marginBottom:'0.9rem'}}>
              <label style={{display:'block',color:'var(--muted)',fontSize:'0.78rem',fontWeight:500,marginBottom:'0.4rem'}}>Current Password</label>
              <input type="password" style={inp} value={pw.current} onChange={e=>setPw(p=>({...p,current:e.target.value}))}/>
            </div>
            <div style={{marginBottom:'0.9rem'}}>
              <label style={{display:'block',color:'var(--muted)',fontSize:'0.78rem',fontWeight:500,marginBottom:'0.4rem'}}>New Password</label>
              <input type="password" style={inp} value={pw.next} onChange={e=>setPw(p=>({...p,next:e.target.value}))}/>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label style={{display:'block',color:'var(--muted)',fontSize:'0.78rem',fontWeight:500,marginBottom:'0.4rem'}}>Confirm Password</label>
              <input type="password" style={inp} value={pw.confirm} onChange={e=>setPw(p=>({...p,confirm:e.target.value}))}/>
            </div>
            {pwMsg&&<p style={{color:pwMsg.startsWith('✅')?'#34d399':'#f87171',fontSize:'0.82rem',marginBottom:'0.8rem'}}>{pwMsg}</p>}
            <button onClick={changePassword} style={{background:'var(--accent)',color:'white',border:'none',padding:'0.6rem 1.3rem',borderRadius:'7px',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}>Update Password</button>
          </>,
          'Change Password'
        )}
        {card(
          <div style={{display:'flex',flexDirection:'column',gap:'0.7rem'}}>
            <p style={{color:'var(--muted)',fontSize:'0.83rem',marginBottom:'0.5rem'}}>Manage all stored data.</p>
            <button onClick={async()=>{
              const res=await fetch('/api/settings');const settings=await res.json()
              const msgs=await fetch('/api/messages').then(r=>r.json())
              const projs=await fetch('/api/projects').then(r=>r.json())
              const svcs=await fetch('/api/services').then(r=>r.json())
              const blob=new Blob([JSON.stringify({settings,messages:msgs,projects:projs,services:svcs,exported:new Date().toISOString()},null,2)],{type:'application/json'})
              const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='berrybuilds-data.json';a.click()
            }} style={{background:'var(--surface2)',color:'var(--text)',border:'1px solid var(--border)',padding:'0.6rem 1.1rem',borderRadius:'7px',fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif',textAlign:'left'}}>📥 Export All Data (JSON)</button>
            <button onClick={async()=>{if(!confirm('Clear all messages?'))return;await fetch('/api/messages',{method:'DELETE'});alert('Messages cleared!')}} style={{background:'rgba(239,68,68,.1)',color:'#f87171',border:'1px solid rgba(239,68,68,.25)',padding:'0.6rem 1.1rem',borderRadius:'7px',fontSize:'0.83rem',cursor:'pointer',fontFamily:'DM Sans, sans-serif',textAlign:'left'}}>🗑️ Clear All Messages</button>
          </div>,
          'Data Management'
        )}
        {card(
          <div style={{background:'rgba(109,40,217,.08)',border:'1px solid rgba(109,40,217,.2)',borderRadius:'8px',padding:'1rem',textAlign:'center'}}>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🔐</div>
            <p style={{color:'var(--muted)',fontSize:'0.84rem',lineHeight:1.6}}>Your data is stored securely in a SQLite database on your server. All API routes are protected with JWT authentication.</p>
          </div>,
          'Security'
        )}
      </div>
    </div>
  )
}
