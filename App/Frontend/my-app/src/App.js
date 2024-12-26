import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Home from './pages/Home.js';
import Login from './pages/auth/Login.js';
import Register from './pages/auth/Register.js';
import MyAccount from './pages/Account.js';
import NotFound from './pages/status/NotFound.js';
import ServerError from './pages/status/ServerError.js';
import Forbidden from './pages/status/Forbidden.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Yükleniyor durumu

  // Sayfa ilk yüklendiğinde session doğrulaması yapılacak
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    
    if (storedUser ) {
      
      setCurrentUser(storedUser);  // localStorage'dan kullanıcıyı al
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);  // localStorage'da oturum bilgisi yoksa giriş durumu false
    }
    setLoading(false); // Kontrol tamamlandığında yükleniyor durumu false
  }, []);
 
    // Session bilgilerini al
    axios.get('http://127.0.0.1:5000/auth/get-session', { withCredentials: true })
  .then(response => {
    console.log("Session verisi:", response.data);
    // Kullanıcı bilgilerini frontend'de kullan
  })
  .catch(error => {
    console.error("Session alınırken hata:", error.response.data);
  });
 

  const location = useLocation();
  const statusCode = parseInt(new URLSearchParams(location.search).get('code'), 10);

  if ([404, 500, 403].includes(statusCode)) {
    return <Navigate to={`/${statusCode}`} />;
  }

  // Yükleniyor durumu
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/403" element={<Forbidden />} />

          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/account"
            element={
              isLoggedIn ? (
                <MyAccount currentUser={currentUser} setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/auth/login" />
              )
            }
          />
          <Route
            path="/auth/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login setCurrentUser={setCurrentUser} setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route
            path="/auth/register"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Register />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;