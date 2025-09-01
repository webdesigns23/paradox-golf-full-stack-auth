import { useState } from "react"
import LoginForm from "../components/LoginForm"
import logo from "../assets/images/logo2.png"


export default function Login({onLogin}) {

	return(
		<>
			<img src={logo} alt="Paradox Golf Logo" width="90%" />
			<LoginForm onLogin={onLogin}/>
		</>
	)
}