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
				body:JSON.stringify({
					username: username.trim(), 
					password})
			});
			const data = await response.json();
			
			if (!response.ok) {
      			throw new Error(data.error?.[0] || "Login Failed!");
			}
			
			onLogin?.(data.token, data.user);
		} catch (error) {
			console.error("Login request failed:", error)
			setError(error.message);
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

			{error && <p className="error"> {error}</p>}

			<div className="button">
				<button type="submit">
					{loading ? "Logging in..." : "Login"}
				</button>
			</div>
		</form>
	)
}