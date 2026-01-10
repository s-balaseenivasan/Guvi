import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // State to handle messages
    const navigate = useNavigate();

    const submit = async () => {
        try {
            await axios.post(`https://password.upgradenow.online/api/auth/reset-password/${token}`, {
                password,
            });
            setMessage("Password updated successfully");
            setTimeout(() => navigate("/login"), 2000); // Redirect after success
        } catch (err) {
            setMessage(err.response?.data?.message || "Link expired or invalid");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h3 className="mb-3 text-center">Reset Password</h3>

                        {/* Display alert message */}
                        {message && (
                            <div className="alert alert-info text-center">
                                {message}
                            </div>
                        )}

                        <input
                            type="password"
                            className="form-control"
                            placeholder="New Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            className="btn btn-primary mt-3 w-100"
                            onClick={submit}
                        >
                            Reset Password
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/">Back to Forgot Password</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
