import { useState } from "react";

export default function SignUpForm({onLogin}) {
	const [username, setUsername] = useState("");
  	const [password, setPassword] = useState("");
  	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [displayName, setDisplayName] = useState("");

	const [error, setError] = useState(null);
	const [usernameError, setUsernameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [loading, setLoading] = useState(false);

	async function handleSignup(e) {
		e.preventDefault();
		setError(null);

		try {
			setLoading(true);
			const response = await fetch("http://127.0.0.1:5555/signup", {
				method: "POST",
				headers:{"Content-Type": "application/json"},
				body:JSON.stringify({
					username, 
					password, 
					password_confirmation: passwordConfirmation, display_name:displayName,
				})
			});
			if (!response.ok) {
				throw new Error(`${response.status}`);
			}
			const data = await response.json();
			onLogin?.(data.token, data.user);
		} catch (error) {
			console.error("Login request failed:", error)
			setError(`Login request failed: ${error.message}`);
		} finally {
			setLoading(false);
		}
	}

	return(
		<form className="signup_form" onSubmit={handleSignup}>
			<div className="form_field">
				<label> Username:
					<input 
					type="text" 
					placeholder="username" 
					value={username}
					onChange={(e) =>setUsername(e.target.value)} 
					required
					maxLength={35}
					/>
				</label>
			</div>
			<div className="form_field">
				<label> Password:
					<input 
					type="password" 
					placeholder="password" 
					value={password}
					onChange={(e) =>setPassword(e.target.value)} 
					required
					maxLength={35}
					/>
				</label>
			</div>
			<div className="form_field">
				<label> Confirm Password:
					<input 
					type="password" 
					placeholder="password confirmation" 
					value={passwordConfirmation}
					onChange={(e) =>setPasswordConfirmation(e.target.value)} 
					required
					maxLength={35}
					/>
				</label>
			</div>
			<div className="form_field">
				<label> Display Name:
					<input 
					type="text" 
					placeholder="display name" 
					value={displayName}
					onChange={(e) =>setDisplayName(e.target.value)} 
					required
					maxLength={35}
					/>
				</label>
			</div>
			<div className="button">
				<button type="submit">
					Sign Up
				</button>
			</div>
		</form>
	)
}