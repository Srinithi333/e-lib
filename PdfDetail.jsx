import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import PdfViewerModal from './PdfViewerModal';

export default function PdfDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [book, setBook] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  useEffect(()=>{ API.get(`/books/${id}`).then(r=>setBook(r.data)).catch(()=>nav('/library')); },[id]);
  if(!book) return <div>Loading...</div>;
  return (
    <div>
      <h3>{book.title}</h3>
      <div style={{ color:'#555' }}>
        <div>Authors: {(book.authors||[]).join(', ') || 'Unknown'}</div>
        <div>Uploaded: {new Date(book.createdAt).toLocaleString()}</div>
        <div>Size: {book.size ? (book.size/1024).toFixed(1) + ' KB' : '—'}</div>
      </div>
      <p>{book.description}</p>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={()=> setShowViewer(true)}>View in modal</button>
        <a href="#" onClick={async e => { e.preventDefault(); const res=await API.get(`/books/${id}/presign`); window.open(res.data.url); }}>Open/Download</a>
      </div>
      {showViewer && <PdfViewerModal id={id} onClose={()=>setShowViewer(false)} />}
    </div>
  );
}
