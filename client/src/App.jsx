import React, { useEffect, useState } from "react";
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { RoundsProvider } from "./context/RoundContext";
import Home from './pages/Home';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Rounds from "./pages/Rounds";
import AddRound from "./pages/AddRound";
import AddShots from "./pages/AddShots";
import RoundDetails from "./components/RoundFeatures/RoundDetails"
import Challenges from "./pages/Challenges";
import NavBar from "./components/NavBar";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
    <RoundsProvider>
      <BrowserRouter>
      <NavBar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/rounds" element={<Rounds />} />
          <Route path="/rounds/new" element={<AddRound />} />
          <Route path="/rounds/:id" element={<RoundDetails />} />
          <Route path="/rounds/:id/shots" element={<AddShots />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </BrowserRouter>
    </RoundsProvider>
  )
}


