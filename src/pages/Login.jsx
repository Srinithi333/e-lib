import React, { useState, useContext } from 'react';
import API from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Login(){
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || '/library';
  async function submit(e){
    e.preventDefault();
    const res = await API.post('/auth/login', { email, password });
    login(res.data.token, res.data.user);
    nav(from, { replace:true });
  }
  async function devLogin(provider){
    try{
      // provider ignored for now; call backend dev-login
      const emailToUse = provider === 'github' ? 'gh@local' : 'g@local';
      const res = await API.post('/auth/dev-login', { email: emailToUse, name: provider });
      login(res.data.token, res.data.user);
      nav(from, { replace:true });
    } catch(e){
      const msg = e?.response?.data?.message || e.message || 'Login failed';
      alert('Dev login error: ' + msg);
    }
  }
  async function register(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { email, password, name });
      login(res.data.token, res.data.user);
      nav(from, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setIsLogin(true)} 
          style={{ 
            padding: '8px 16px',
            background: isLogin ? '#007bff' : '#f8f9fa',
            color: isLogin ? 'white' : 'black',
            border: 'none',
            marginRight: '10px'
          }}
        >
          Login
        </button>
        <button 
          onClick={() => setIsLogin(false)}
          style={{ 
            padding: '8px 16px',
            background: !isLogin ? '#007bff' : '#f8f9fa',
            color: !isLogin ? 'white' : 'black',
            border: 'none'
          }}
        >
          Register
        </button>
      </div>

      <form onSubmit={isLogin ? submit : register} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button type="button" onClick={()=>devLogin('google')} style={{ width: '100%', display:'flex', alignItems:'center', gap:8, padding: '10px', borderRadius:6, border:'1px solid #ddd', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
            <span style={{ fontSize:18 }}>🔎</span>
            <span style={{ flex:1 }}>Continue with Google</span>
            <span style={{ opacity:0.6, fontSize:12 }}>dev</span>
          </button>
          <button type="button" onClick={()=>devLogin('github')} style={{ width: '100%', display:'flex', alignItems:'center', gap:8, padding: '10px', borderRadius:6, border:'1px solid #ddd', background:'#111', color:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.12)'}}>
            <span style={{ fontSize:18 }}>🐙</span>
            <span style={{ flex:1 }}>Continue with GitHub</span>
            <span style={{ opacity:0.6, fontSize:12 }}>dev</span>
          </button>
        </div>
        
        {!isLogin && (
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Name" 
            required
          />
        )}
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          type="email" 
          required
        />
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          type="password" 
          required
        />
        <button style={{ 
          padding: '10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}
