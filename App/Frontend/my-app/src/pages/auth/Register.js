import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

const RegisterPage = ({ setUsers }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 201) {
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        navigate("/auth/login");
      } else {
        alert(response.data.message || "Bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Bir hata oluştu.");
      } else {
        setErrorMessage("Sunucuya bağlanırken bir hata oluştu.");
      }
    }
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <Link to="/">
          <button style={{ borderRadius: "6px", padding: "10px 20px" }}>Home</button>
        </Link>
        <Link to="/auth/login">
          <button style={{ borderRadius: "6px", padding: "10px 20px" }}>Login</button>
        </Link>
      </div>
      <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;