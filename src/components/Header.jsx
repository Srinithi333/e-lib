import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Header(){
  const { user, logout } = useContext(AuthContext);
  return (
    <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
      <div>
        <Link to="/library" style={{ marginRight: 12 }}>Library</Link>
        <Link to="/admin/upload">Upload</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight:12 }}>Hello, {user.name || user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
