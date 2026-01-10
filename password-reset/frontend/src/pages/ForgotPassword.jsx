import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const submit = async (e) => {
    e.preventDefault();  
    if (!email) {
      setMessage("Please enter an email address.");
      return;
    }

   
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true); 
    try {
      const response = await axios.post(
        "https://password.upgradenow.online/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message || "Password reset link sent.");
    } catch (err) {
      setMessage(err.response?.data?.message || "User not found.");
    } finally {
      setLoading(false); 
    }
  };

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

            
            <input
              type="email"
              className="form-control"
              required
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
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
