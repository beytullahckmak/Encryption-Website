import React, { useState } from "react";
import { useNavigate,Link } from "react-router";

const RegisterPage = ({setUsers}) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Before Save:", formData);
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, formData];
      console.log("Updated Users:", updatedUsers);
      return updatedUsers;
    });
    navigate('/auth/login');
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
                <Link to="/auth/login">
                  <button style={{borderRadius:'6px', padding: "10px 20px" }}>Login</button>
                </Link>
      </div>
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column",gap:"10px"}}>
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
    </div>
    </div>
  );
};

export default RegisterPage;