import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const server_url=import.meta.env.VITE_SERVER_URL;

  function handleEmailChange(e){
    setEmail(e);
    setMessage("");

  }
  function handlePasswordChange(e){
    setPassword(e);
    setMessage("");
    
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${server_url}/api/auth/login`,
        { email, password }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-3">Login</h3>

            {message && (
              <div className="alert alert-info text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>

            <div className="text-center mt-3">
              <Link to="/">Forgot Password?</Link>
              <br />
              <Link to="/register">Create new account</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
