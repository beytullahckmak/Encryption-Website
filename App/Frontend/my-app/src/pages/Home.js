import React, {useState} from 'react'
import { FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';
import {Link} from 'react-router-dom'



const Home = ({ isLoggedIn, setIsLoggedIn }) => {

  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [password, setPassword] = useState('12345');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Generate Password');

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleGeneratePassword = () => {
    setButtonText('Password Generated');
    if (isCheckboxChecked) {
      setShowPasswordBox(false);
    } else {
      setShowPasswordBox(true);
    }
  };

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
  };


  return (

    <div style={{position: "relative", height: "100vh", padding: '20px', fontFamily: 'Arial, sans-serif' }}>

      {!isLoggedIn?(
        <div style={{ 
          position: "fixed", 
          top: "20px", 
          right: "20px", 
          display: "flex", 
          gap: "10px" 
        }}>
          <Link to="/auth/login">
            <button style={{borderRadius:'6px', padding: "10px 20px" }}>Login</button>
          </Link>
          <Link to="/auth/register">
            <button style={{borderRadius:'6px', padding: "10px 20px" }}>Register</button>
          </Link>
          </div>
      ):(
        <div style={{ 
          position: "fixed", 
          top: "20px", 
          right: "20px", 
          display: "flex", 
          gap: "10px" 
        }}>
          <Link to="/account">
            <button style={{borderRadius:'6px', padding: "10px 20px" }}>Account</button>
          </Link>
            <button onClick={handleLogout} style={{borderRadius:'6px', padding: "10px 20px" }}>Logout</button>
          </div>
      )
      }
      

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%",flexDirection:"column" }}>
      {isCheckboxChecked && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
        </div>
      )}

      <button
        onClick={handleGeneratePassword}
        style={{borderRadius:'6px', padding: '10px 20px', fontSize: '16px', marginBottom: '10px' }}
      >
        {buttonText}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="checkbox"
          checked={isCheckboxChecked}
          onChange={handleCheckboxChange}
          style={{ marginRight: '10px' }}
        />
        <span>Send password to email</span>
      </div>

      {showPasswordBox && !isCheckboxChecked && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
            width: '300px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
            color: 'black'
          }}
        >
          <span style={{
            fontFamily: 'monospace',
            fontFamily: 'monospace',
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            textAlign: 'center',}}>
            {isPasswordVisible ? password : '*****'}
          </span>
        <div style={{display:'flex',gap:'5px'}}>
          <button
            onClick={handleCopyPassword}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <FaCopy />
          </button>
          <button
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Home;