import React from "react";
import {NavLink} from "react-router-dom";
import "../styles/NavBar.css"
import logo from "../assets/images/logo1.png"

export default function NavBar(){
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
			
		</ul>
    </nav>
	)
}