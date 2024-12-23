import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';

function Login({ users, setCurrentUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find(
      (user) => user.email === formData.email && user.password === formData.password
    );

    if (user) {
      setCurrentUser(user);
      navigate('/');
    } else {
      setErrorMessage("E-posta veya şifre yanlış. Lütfen tekrar deneyin.");
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
                  <button style={{borderRadius:'6px', padding: "10px 20px" }}>Home</button>
                </Link>
                <Link to="/auth/register">
                  <button style={{borderRadius:'6px', padding: "10px 20px" }}>Register</button>
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