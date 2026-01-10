import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "https://password.upgradenow.online/api/auth/register",
                { email, password }
            );

            setMessage(res.data.message);
            setEmail("");
            setPassword("");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h3 className="text-center mb-3">Register</h3>

                        {message && (
                            <div className="alert alert-info text-center">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Register
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <Link to="/login">Back to Login</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
