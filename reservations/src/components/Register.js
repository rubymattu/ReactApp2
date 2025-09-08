// src/components/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [userName, setUserName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `http://localhost/reactapp2/reservations/reservation_server/api/register.php`,
        {
          userName,
          emailAddress,
          password
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      console.log("Response from PHP:", res.data);

      if (res.data.success) {
        setSuccess(res.data.message);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } 
    catch (err) {
      console.error("Axios error:", err);
      setError("Registration failed");
    }

  };

  return (
<div className="container-fluid d-flex justify-content-center align-items-center vh-100">
  <div className="card shadow p-4  border-0" style={{ maxWidth: "550px", width: "100%" }}>
    <h3 className="text-center mb-4">Register</h3>
    {error && <div className="alert alert-danger">{error}</div>}
    {success && <div className="alert alert-success">{success}</div>}

    <form onSubmit={handleSubmit}>
      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label text-end">Username:</label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Set Your Username"
            required
          />
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label text-end">Email:</label>
        <div className="col-sm-8">
          <input
            type="email"
            className="form-control"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Enter Your Email Address"
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
            placeholder="Set Your Password"
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <button className="btn btn-dark w-50" type="submit">
          Register
        </button>
      </div>
    </form>

    <p className="mt-3 text-center">
      Already have an account? <Link to="/login">Login</Link>
    </p>
  </div>
</div>
  );
}

export default Register;
