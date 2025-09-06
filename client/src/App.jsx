import React, { useEffect, useState } from "react";
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { RoundsProvider } from "./context/RoundContext";
import Home from "./pages/Home";
import About from "./pages/About"
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rounds from "./pages/Rounds";
import AddRound from "./pages/AddRound";
import AddShots from "./pages/AddShots";
import RoundDetails from "./components/RoundFeatures/RoundDetails"
import Challenges from "./pages/Challenges";
import NavBar from "./components/NavBar";
import meeseekTip from "./assets/images/meeseeks/golf_tip.PNG"

export default function App() {
  const [user, setUser] = useState(null);
  const [checkAuth, setCheckAuth] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCheckAuth(false);
      return;
    }
    (async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/me" ,{
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const me = await response.json();
          setUser(me);
        } else if (response.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (_) {
        setUser(null);
      } finally {
        setCheckAuth(false);
      }
    })();
  },[]);


  const onLogin = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user)
  }
  
  if (checkAuth) return <div>  
    <p>Initilizing Portal Travel.....</p>
    <img src={meeseekTip} width="95%" margin-top="200px" alt="meeseeks on golf course"/>
    <h1>Meeseeks Golf Tip #1</h1>
    </div>
  if (!user) return <Login onLogin={onLogin}/>;

  return (
    <RoundsProvider>
      <BrowserRouter>
      <NavBar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home user={user}/>} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/rounds" element={<Rounds />} />
          <Route path="/rounds/new" element={<AddRound />} />
          <Route path="/rounds/:id" element={<RoundDetails />} />
          <Route path="/rounds/:id/shots" element={<AddShots />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </RoundsProvider>
  )
}


