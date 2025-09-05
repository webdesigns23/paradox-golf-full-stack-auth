import { useState } from "react"
import LoginForm from "../components/LoginForm"
import SignUpForm from "../components/SignUpForm"
import logo from "../assets/images/paradox_golf_logo.png"


export default function Login({onLogin}) {
	const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      <div className="login_logo">
        <img src={logo} alt="Paradox Golf Logo" width="90%" />
      </div>
      {showSignup ? (
        <SignUpForm onLogin={onLogin} />
      ) : (
        <LoginForm onLogin={onLogin} />
      )}

      <hr />
      <p>
        {showSignup ? "Already have an account?" : "Don't have an account?"}
        <br />
        <button onClick={() => setShowSignup(prevState => !prevState)}>
          {showSignup ? "Back to Login" : "Sign Up Now!"}
        </button>
      </p>
    </div>
  );
}