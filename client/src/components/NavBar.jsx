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
		<img src={logo} width="100%" alt="meeseeks on golf course"/>

		<ul className="nav-links">
			<NavLink to="/">Home</NavLink>
			<NavLink to="/dashboard">Dashboard</NavLink>
			<NavLink to="/courses">Courses</NavLink>
			<NavLink to="/rounds">Rounds</NavLink>
			<NavLink to="/stats">Stats</NavLink>
			<NavLink to="/challenges">Challenges</NavLink>

       		<button variant="outline" onClick={handleLogout}>
				Logout
			</button>
		</ul>
    </nav>
	)
}