import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Library(){
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');

  // human-friendly category map (fallback)
  const categoryMap = {
    a: 'Programming',
    b: 'Web Development',
    c: 'Data Structures',
    d: 'Algorithms'
  };

  useEffect(()=>{
    let cancelled = false;
    API.get('/books', { params: { page, pageSize, q }}).then(r=>{
      if(cancelled) return;
      setBooks(r.data.docs || []);
      setTotal(r.data.total||0);
    }).catch(()=>{});
    return ()=>{ cancelled = true; };
  },[page,pageSize,q]);
  // derive categories from books if present
  const derivedCats = Array.from(new Set([].concat(...books.map(b => b.categories || []))));
  const categories = [{ id: 'all', label: 'All' }].concat(
    derivedCats.map(id => ({ id, label: categoryMap[id] || id }))
  );
  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.categories?.includes(selectedCategory));

  return (
    <div>
      <h2>Library</h2>
      
      {/* Filter Categories */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Filter by Category:</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                background: selectedCategory === category.id ? '#007bff' : '#f1f3f5',
                color: selectedCategory === category.id ? 'white' : '#333',
                cursor: 'pointer',
                boxShadow: selectedCategory === category.id ? '0 2px 6px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by title" style={{ padding:8, borderRadius:6, border:'1px solid #ddd' }} />
        </div>
        <div style={{ color:'#666' }}>{total} books</div>
      </div>

      {/* If no books are present, show seed button for convenience */}
      {total === 0 && (
        <div style={{ margin:'12px 0' }}>
          <div style={{ marginBottom:8 }}>No books found in the database yet.</div>
          <button onClick={async ()=>{
            try{
              const res = await API.post('/auth/seed');
              // If seed returns books or createdCount, refresh
              setPage(1);
              API.get('/books', { params: { page:1, pageSize, q:'' }}).then(r=>{ setBooks(r.data.docs||[]); setTotal(r.data.total||0); });
              alert('Seed completed. ' + (res.data.createdCount ? (res.data.createdCount + ' books added') : 'Seed returned results'));
            }catch(e){ alert('Seed failed: ' + (e?.response?.data?.error || e.message)); }
          }} style={{ padding:8, background:'#0b3d91', color:'#fff', border:'none', borderRadius:6 }}>Seed sample books</button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {filteredBooks.map(b => (
          <div key={b._id} style={{ display:'flex', gap:12, padding:16, border:'1px solid #eee', borderRadius:10, background:'#fff', boxShadow:'0 4px 12px rgba(15,15,15,0.03)' }}>
            <div style={{ width:96, height:128, background:'#f6f7fb', borderRadius:6, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {b.coverUrl ? (
                <img src={b.coverUrl} alt={b.title} style={{ maxWidth:'100%', maxHeight:'100%' }} />
              ) : (
                <div style={{ color:'#9aa0b4', fontSize:12, textAlign:'center', padding:8 }}>No cover</div>
              )}
            </div>
            <div style={{ flex:1 }}>
              <h3 style={{ margin:'0 0 6px 0', color:'#0b3d91' }}>{b.title}</h3>
              <div style={{ fontSize:13, color:'#4d5566', marginBottom:6 }}>
                <div><strong>Author(s):</strong> {(b.authors||[]).join(', ') || 'Unknown'}</div>
                <div><strong>Genre:</strong> {(b.categories||[]).map(c => (categories.find(x=>x.id===c)||{label:c}).label).join(', ') || '—'}</div>
                <div style={{ display:'flex', gap:8 }}>
                  {b.publisher && <div><strong>Publisher:</strong> {b.publisher}</div>}
                  {b.year && <div><strong>Year:</strong> {b.year}</div>}
                  {b.isbn && <div><strong>ISBN:</strong> {b.isbn}</div>}
                </div>
              </div>
              <p style={{ color:'#333', margin:'6px 0' }}>{(b.description||'').slice(0,220)}</p>
              <div style={{ display:'flex', gap:12, marginTop:8 }}>
                <Link to={`/pdf/${b._id}`} style={{ color:'#0b3d91', textDecoration:'none', fontWeight:600 }}>Details</Link>
                <button 
                  type="button"
                  onClick={async e => { const res=await API.get(`/books/${b._id}/presign`); window.open(res.data.url); }}
                  style={{ background:'#0b3d91', border:'none', color:'#fff', padding:'8px 12px', borderRadius:6, cursor:'pointer' }}
                >
                  Read / Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:16 }}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1} style={{ padding:8 }}>Prev</button>
        <div style={{ padding:8 }}>Page {page} of {Math.max(1, Math.ceil(total/pageSize))}</div>
        <button onClick={()=>setPage(p=>p+1)} disabled={page>=Math.ceil(total/pageSize)} style={{ padding:8 }}>Next</button>
      </div>
    </div>
  );
}
