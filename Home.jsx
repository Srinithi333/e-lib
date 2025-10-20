import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Home(){
  const [books, setBooks] = useState({ docs: [] });
  useEffect(()=>{ API.get('/books').then(r=>setBooks(r.data)).catch(()=>{}); },[]);
  const highlights = (books.docs || []).slice(0,3);
  return (
    <div>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ margin:0, color:'#0b3d91' }}>E-Library</h1>
          <p style={{ margin:0, color:'#5b6b85' }}>Browse and read books online — curated for demo</p>
        </div>
        <div>
          <Link to="/library" style={{ background:'#0b3d91', color:'#fff', padding:'10px 14px', borderRadius:8, textDecoration:'none' }}>Go to Library</Link>
        </div>
      </header>

      <section>
        <h2 style={{ color:'#0b3d91' }}>Featured</h2>
        <div style={{ display:'flex', gap:12 }}>
          {highlights.map(b => (
            <div key={b._id} style={{ flex:1, padding:12, border:'1px solid #eee', borderRadius:8 }}>
              <h4 style={{ margin:0 }}>{b.title}</h4>
              <div style={{ fontSize:13, color:'#666' }}>{(b.authors||[]).join(', ')}</div>
              <p style={{ color:'#333' }}>{(b.description||'').slice(0,100)}</p>
              <Link to={`/pdf/${b._id}`} style={{ color:'#0b3d91' }}>Read</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}