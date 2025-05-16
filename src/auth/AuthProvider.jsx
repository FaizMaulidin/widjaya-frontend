import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token')
    return stored ? stored : null
  })

  const login = async(data, setError) => {
    console.log(import.meta.env.VITE_DB_ENDPOINT)
    try {
      const response = await axios.post(import.meta.env.VITE_DB_ENDPOINT + "login", data);
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token);
      console.log("Login successful!");
    } catch (error) {
      setError("Invalid")
      setTimeout(() => {
        setError(null)
      }, 500);
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
        <div className=' font-default'>
            {children}
        </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
