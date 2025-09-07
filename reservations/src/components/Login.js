import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
     try {
    const res = await axios.post(
      `http://localhost/reactapp2/reservations/reservation_server/api/login.php`,
      { userName, password },
      { withCredentials: true }
    );
    console.log("Login response:", res.data);
    if (res.data.success) {
      setUser(res.data.user);
      navigate("/");
    } else {
      setError(res.data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Axios login error:", err);
    setError("Login failed");
  }

  };

  return (
<div className="container-fluid d-flex justify-content-center align-items-center vh-100">
  <div className="card shadow p-4 border-0" style={{ maxWidth: "500px", width: "100%" }}>
    <h3 className="text-center mb-4">Login</h3>
    {error && <div className="alert alert-danger">{error}</div>}

    <form onSubmit={handleSubmit}>
      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label text-end">Username:</label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter Your Username"
            required
          />
        </div>
      </div>

      <div className="mb-4 row">
        <label className="col-sm-4 col-form-label text-end">Password:</label>
        <div className="col-sm-8">
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <button className="btn btn-dark w-50" type="submit">
          Login
        </button>
      </div>
    </form>

    <p className="mt-3 text-center">
      Don’t have an account? <Link to="/register">Register</Link>
    </p>
  </div>
</div>
  );
}

export default Login;
