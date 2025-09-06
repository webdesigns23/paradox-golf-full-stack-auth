import React from "react";
import {NavLink} from "react-router-dom";
import "../styles/NavBar.css"
import logo from "../assets/images/logo1.png"

export default function NavBar({user, setUser}){

	function handleLogout() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
    localStorage.removeItem("token");
    setUser(null);
  }

	return(
		<nav className="navbar">
		<button className="logout_btn" onClick={handleLogout}>
			Logout
		</button>	

		<img src={logo} width="100%" alt="paradox golf logo"/>

		<h2>welcome {user?.username}</h2>

		<ul className="nav-links">
			<NavLink to="/">Home</NavLink>
			<NavLink to="/dashboard">Dashboard</NavLink>
			<NavLink to="/courses">Courses</NavLink>
			<NavLink to="/rounds">Rounds</NavLink>
			<NavLink to="/challenges">Challenges</NavLink>
			<NavLink to="/about">About</NavLink>
		</ul>
    </nav>
	)
}