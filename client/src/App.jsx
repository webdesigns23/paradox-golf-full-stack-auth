import React, { useEffect, useState } from "react";
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // auto-login
    fetch("/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
    ).then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  const onLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user)
  }
  if (!user) return <Login onLogin={onLogin}/>;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


