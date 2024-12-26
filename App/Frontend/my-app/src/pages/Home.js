import React, { useState } from 'react';
import { FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [password, setPassword] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Generate Password');

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const handleGeneratePassword = async () => {
    setButtonText('Generating Password...');

    try {
      // API'ye GET isteği at
      const response = await axios.get('http://127.0.0.1:5000/strong-password');
      if (response.data.status === 'success') {
        const { password } = response.data;
        setPassword(password); // Şifreyi state'e kaydet
        setShowPasswordBox(true); // Şifre kutusunu göster
        setButtonText('Password Generated');
      } else {
        alert('Error generating password');
        setButtonText('Generate Password');
      }
    } catch (error) {
      console.error('Error while generating password:', error);
      alert('API isteğinde bir hata oluştu.');
      setButtonText('Generate Password');
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
    <div style={{ position: 'relative', height: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {!isLoggedIn ? (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <Link to="/auth/login">
            <button style={{ borderRadius: '6px', padding: '10px 20px' }}>Login</button>
          </Link>
          <Link to="/auth/register">
            <button style={{ borderRadius: '6px', padding: '10px 20px' }}>Register</button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <Link to="/account">
            <button style={{ borderRadius: '6px', padding: '10px 20px' }}>Account</button>
          </Link>
          <button onClick={handleLogout} style={{ borderRadius: '6px', padding: '10px 20px' }}>
            Logout
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flexDirection: 'column',
        }}
      >
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
          style={{ borderRadius: '6px', padding: '10px 20px', fontSize: '16px', marginBottom: '10px' }}
        >
          {buttonText}
        </button>

        {showPasswordBox && (
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
              color: 'black',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                textAlign: 'center',
              }}
            >
              {isPasswordVisible ? password : '*****'}
            </span>
            <div style={{ display: 'flex', gap: '5px' }}>
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
  );
};

export default Home;