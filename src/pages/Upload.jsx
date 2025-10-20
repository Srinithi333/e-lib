import React, { useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export default function Upload(){
  const { user } = useContext(AuthContext);
  const [file,setFile] = useState(null);
  const [title,setTitle] = useState('');
  async function submit(e){
    e.preventDefault();
    if(!user || user.role !== 'admin') return alert('Admin only');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    const res = await API.post('/books/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert('Uploaded: ' + res.data.title);
  }
  return (
    <form onSubmit={submit}>
      <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
      <button>Upload</button>
    </form>
  );
}
