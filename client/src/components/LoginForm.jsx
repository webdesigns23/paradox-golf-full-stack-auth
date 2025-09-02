import { useState } from "react";

export default function LoginForm({onLogin}) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);

		try {
			setLoading(true);
			const response = await fetch("http://127.0.0.1:5555/login", {
				method: "POST",
				headers:{"Content-Type": "application/json"},
				body:JSON.stringify({username, password})
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
		<form className="login_form" onSubmit={handleSubmit}>
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
			<div className="button">
				<button type="submit">
					Login
				</button>
			</div>
		</form>
	)
}