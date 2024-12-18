import './App.css';
import {Routes,Route} from 'react-router-dom'

import Login from './pages/auth/Login.js'
import Register from './pages/auth/Register.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Routes>
            <Route path="auth/login" element={<Login />} />
            <Route path='auth/register' element= {<Register />} />
          </Routes>
      </header>
    </div>
  );
}

export default App;
