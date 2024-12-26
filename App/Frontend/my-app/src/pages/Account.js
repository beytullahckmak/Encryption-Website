import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaEdit, FaTrash, FaSave } from 'react-icons/fa';

const MyAccount = ({ currentUser, setIsLoggedIn }) => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kullanıcıdan şifreleri al
  const fetchPasswords = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/page/passwords');
      console.log(response)
      setPasswords(response.data.passwords || []);
      setLoading(false);
    } catch (error) {
      console.error('Hata oluştu:', error);
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde şifreleri al
  useEffect(() => {
    fetchPasswords();
  }, []);

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  // Şifreyi düzenleme
  const handleEdit = (id) => {
    const updatedPasswords = passwords.map(item =>
      item.id === id ? { ...item, isEditable: true } : item
    );
    setPasswords(updatedPasswords);
  };

  // Kaydetme işlemi
  const handleSave = async (id, newPassword) => {
    try {
      await axios.put(`http://127.0.0.1:5000/page/update/${id}`, { secure_password: newPassword }, { withCredentials: true });
      fetchPasswords(); // Güncelleme işlemi sonrası şifreleri tekrar al
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  // Şifreyi gösterme/gizleme
  const handleShow = (id) => {
    const updatedPasswords = passwords.map(item =>
      item.id === id ? { ...item, isPasswordVisible: !item.isPasswordVisible } : item
    );
    setPasswords(updatedPasswords);
  };

  // Şifreyi silme
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/page/delete/${id}`, { withCredentials: true });
      fetchPasswords(); // Silme işlemi sonrası şifreleri tekrar al
    } catch (error) {
      console.error('Silme hatası:', error);
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
        <button onClick={handleLogout} style={{ borderRadius: '6px', padding: "10px 20px" }}>Logout</button>
      </div>

      <div style={{ padding: '20px' }}>
        <h2>Passwords</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
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
                      <span>{item.password_name[0]}</span>
                    </div>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    {item.isEditable ? (
                      <input
                        type="text"
                        value={item.secure_password}
                        onChange={(e) => {
                          const updatedPasswords = passwords.map(password =>
                            password.id === item.id ? { ...password, secure_password: e.target.value } : password
                          );
                          setPasswords(updatedPasswords);
                        }}
                        style={{
                          width: '150px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc'
                        }}
                      />
                    ) : (
                      <span>{item.isPasswordVisible ? item.secure_password : '*****'}</span>
                    )}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {!item.isEditable ? (
                        <>
                          <button onClick={() => handleShow(item.id)}>
                            {item.isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button onClick={() => handleEdit(item.id)}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(item.id)}>
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleSave(item.id, item.secure_password)}>
                            <FaSave />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyAccount;