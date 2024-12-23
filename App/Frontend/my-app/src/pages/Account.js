import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router';
import { FaEye, FaEyeSlash, FaEdit, FaTrash, FaSave } from 'react-icons/fa';

const MyAccount = ({ setIsLoggedIn }) => {

  const [passwords, setPasswords] = useState([
    { id: 1, field: 'Şifrem', value: 'sifre123', isPasswordVisible: false, isEditable:false },
    { id: 2, field: 'Pinim', value: '1234', isPasswordVisible: false, isEditable:false },
    { id: 3, field: 'Şifrem 2', value: 'deneme123', isPasswordVisible: false, isEditable:false },
  ]);

  const navigate = useNavigate();
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleEdit = (id) => {
    const updatedPasswords = passwords.map(item =>
      item.id === id ? { ...item, isEditable: true } : item
    );
    setPasswords(updatedPasswords);
  };

  const handleSave = (id, newPassword) => {
    const updatedPasswords = passwords.map(item =>
      item.id === id ? { ...item, value: newPassword, isEditable: false } : item
    );
    setPasswords(updatedPasswords);
  };

  const handleShow = (id) => {
    const updatedPasswords = passwords.map(item =>
      item.id === id ? { ...item, isPasswordVisible: !item.isPasswordVisible } : item
    );
    setPasswords(updatedPasswords);
  };

  const handleDelete = (id) => {
    const updatedPasswords = passwords.filter(item => item.id !== id);
    setPasswords(updatedPasswords);
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
      <button onClick={handleLogout} style={{borderRadius:'6px', padding: "10px 20px" }}>Logout</button>
      </div>

      <div style={{ padding: '20px' }}>
        <h2>Paswords</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Field</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Information</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {passwords.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center'
                  }}>
                    <span>{item.field[0]}</span>
                  </div>
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  {item.isEditable ? (
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => {
                        const updatedPasswords = passwords.map(password =>
                          password.id === item.id ? { ...password, value: e.target.value } : password
                        );
                        setPasswords(updatedPasswords);
                      }}
                      style={{
                        width: '150px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc'
                      }}
                    />
                  ) : (
                    <span>{item.isPasswordVisible ? item.value : '*****'}</span>
                  )}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <button onClick={() => handleShow(item.id)} style={{ margin: '0 5px', border: 'none', background: 'transparent' }}>
                    {item.isPasswordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  {item.isEditable ? (
                    <button
                      onClick={() => handleSave(item.id, item.value)}
                      style={{ margin: '0 5px', border: 'none', background: 'transparent' }}
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(item.id)}
                      style={{ margin: '0 5px', border: 'none', background: 'transparent' }}
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button onClick={() => handleDelete(item.id)} style={{ margin: '0 5px', border: 'none', background: 'transparent' }}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyAccount;