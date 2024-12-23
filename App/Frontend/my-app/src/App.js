import './App.css';
import {Routes,Route,Navigate, useLocation} from 'react-router-dom'
import {useEffect, useState} from 'react';

import Home from './pages/Home.js'
import Login from './pages/auth/Login.js'
import Register from './pages/auth/Register.js'
import MyAccount from './pages/Account.js';
import NotFound from './pages/status/NotFound.js';
import ServerError from './pages/status/ServerError.js';
import Forbidden from './pages/status/Forbidden.js';

function App() {

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  const location = useLocation();
  const statusCode = parseInt(new URLSearchParams(location.search).get('code'), 10);
  
  if ([404, 500, 403].includes(statusCode)) {
    return <Navigate to={`/${statusCode}`} />;
  }

  return (
    <div className="App">
      <header className="App-header">
      <Routes>
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/403" element={<Forbidden />} />

          <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/account" element={isLoggedIn ? <MyAccount currentUser={currentUser} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/auth/login" />} />
          <Route path="/auth/login" element={<Login users={users} setCurrentUser={setCurrentUser} />} />
          <Route path="/auth/register" element={<Register setUsers={setUsers} />} />

          <Route path="*" element={<NotFound />} />
          </Routes>
      </header>
    </div>
  );
}

export default App;
