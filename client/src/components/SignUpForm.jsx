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
		setUsernameError(null);
		setPasswordError(null);

		if (password !== passwordConfirmation) {
			setPasswordError("Passwords do not match, try again!");
			return;
		}

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
			const data = await response.json();

			if (!response.ok) {
				if (data?.errors) {
					setUsernameError(data.errors.username || null);
					setPasswordError(
						data.errors.password || data.errors.password_confirmation || null
					);
					setError(
						data.errors.display_name ||
						data.errors.non_field ||
						null
					);
				} else if (typeof data?.error === "string") {
					setError(data.error);
				} else {
					setError("Signup failed. Please try again.");
				}
				return;
}
						
			onLogin?.(data.token, data.user);

		} catch (error) {
			console.error("Signup request failed:", error)
			setError(`Signup request failed: ${error.message}`);
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
				{usernameError && <p className="error">{usernameError}</p>}
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
				{passwordError && <p className="error">{passwordError}</p>}
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
			{error && <p className="error"> {error}</p>}

			<div className="button">
				<button type="submit" disabled={loading}>
					{loading ? "Signing Up..." : "Sign Up"}
				</button>
			</div>
		</form>
	)
}