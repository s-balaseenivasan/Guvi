import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 
  const server_url = import.meta.env.VITE_SERVER_URL;

  const submit = async () => {
    if (!email || !email.includes('@')) {
      setMessage("Please enter a valid email address.");
      return;
    }
    try {
      await axios.post(`${server_url}/api/auth/forgot-password`, { email });
      setMessage("Password reset link sent.");
    } catch (err) {
      setMessage(err.response?.data?.message || "User not found.");
    }
  };
  function handleEmailChange(e){
    setEmail(e);
    setMessage("");

  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow">
            <h3 className="mb-3 text-center">Forgot Password</h3>

           
            {message && (
              <div className="alert alert-info text-center">
                {message}
              </div>
            )}
            <input type="email" required className="form-control" value={email}
              placeholder="Enter Email"
              onChange={(e) => handleEmailChange(e.target.value)}/>

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={submit}
            >
              Send Reset Link
            </button>

            <div className="text-center mt-3">
              <Link to="/login">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
