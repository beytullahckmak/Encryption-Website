import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ setCurrentUser, setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Giriş başarılı!");
        localStorage.setItem("currentUser", JSON.stringify({
          username: response.data.username,
          sessionId: response.data.session
        }));
        localStorage.setItem("isLoggedIn", "true");
        setCurrentUser(response.data.username);
        setIsLoggedIn(true);  // Oturum açıldığını belirt
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Sunucuya bağlanırken bir hata oluştu.");
      }
    }
  };
  

  return (
    <div>
      <div style={{ 
        position: "fixed", 
        top: "20px", 
        right: "20px", 
        display: "flex", 
        gap: "10px" 
      }}>
        <Link to="/">
          <button style={{ borderRadius: '6px', padding: "10px 20px" }}>Home</button>
        </Link>
        <Link to="/auth/register">
          <button style={{ borderRadius: '6px', padding: "10px 20px" }}>Register</button>
        </Link>
      </div>

      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
          <button type="submit">Login</button>
        </form>

        {errorMessage && (
          <div style={{
            color: "red",
            fontSize: "12px",
            marginTop: "10px",
            wordWrap: "break-word",
            whiteSpace: "normal"
          }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;