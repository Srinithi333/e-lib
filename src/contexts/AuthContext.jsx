import React, { createContext, useState } from 'react';
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')|| 'null'));
  const login = (token, userObj) => { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(userObj)); setUser(userObj); };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
