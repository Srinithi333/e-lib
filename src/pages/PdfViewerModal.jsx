import React, { useEffect, useState } from 'react';
import API from '../services/api';
// react-pdf is optional; if not installed the modal will show a link

export default function PdfViewerModal({ id, onClose }){
  const [url, setUrl] = useState('');
  useEffect(()=>{ API.get(`/books/${id}/presign`).then(r=>setUrl(r.data.url)).catch(()=>{}); },[id]);
  if(!url) return <div>Loading viewer...</div>;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'80%', height:'80%', background:'#fff', padding:12, overflow:'auto' }}>
        <button onClick={onClose}>Close</button>
        <div style={{ marginTop: 8 }}>
          <a href={url} target="_blank" rel="noreferrer">Open PDF in new tab</a>
        </div>
      </div>
    </div>
  );
}
