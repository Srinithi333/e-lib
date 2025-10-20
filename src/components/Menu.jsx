import React from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  const menuItems = [
    { label: 'Option A', path: '/option-a' },
    { label: 'Option B', path: '/option-b' },
    { label: 'Option C', path: '/option-c' },
    { label: 'Option D', path: '/option-d' }
  ];

  return (
    <nav style={{ 
      background: '#f0f0f0',
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '4px'
    }}>
      <ul style={{ 
        listStyle: 'none',
        display: 'flex',
        gap: '20px',
        margin: 0,
        padding: 0
      }}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path} style={{
              textDecoration: 'none',
              color: '#333',
              padding: '5px 10px',
              borderRadius: '3px',
              transition: 'background-color 0.2s'
            }}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}