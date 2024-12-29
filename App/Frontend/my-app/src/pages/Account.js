import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEdit, FaTrash, FaSave } from 'react-icons/fa';

const MyAccount = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Verileri başlangıçta localStorage'dan yükle
  const initialPasswords = JSON.parse(localStorage.getItem("passwords")) || [
    { id: 1, password_name: 'Sık Kullandığım', secure_password: 'Y(jyA<omOVjt', isEditable: false, isPasswordVisible: false },
    { id: 2, password_name: 'Ortak Olan', secure_password: '6i3LVEf_mj:', isEditable: false, isPasswordVisible: false },
    { id: 3, password_name: 'Önemli Olmayan', secure_password: 'fZ4rq,(c[6e', isEditable: false, isPasswordVisible: false }
  ];

  const [passwords, setPasswords] = useState(initialPasswords);
  const [newPassword, setNewPassword] = useState({ password_name: '', secure_password: '' });

  // Verileri localStorage'a kaydet
  const saveToLocalStorage = (updatedPasswords) => {
    localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
  };

  // Şifreler güncellendiğinde localStorage'a kaydet
  useEffect(() => {
    saveToLocalStorage(passwords);
  }, [passwords]);

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
  const handleSave = (id, newPassword, newName) => {
    const updatedPasswords = passwords.map(item =>
      item.id === id ? { ...item, secure_password: newPassword, password_name: newName, isEditable: false } : item
    );
    setPasswords(updatedPasswords);
  };

  // Şifreyi gösterme/gizleme
  const handleShow = (id) => {
    const updatedPasswords = passwords.map(item =>
      item.id === id ? { ...item, isPasswordVisible: !item.isPasswordVisible } : item
    );
    setPasswords(updatedPasswords);
  };

  // Şifreyi silme
  const handleDelete = (id) => {
    const updatedPasswords = passwords.filter(item => item.id !== id);
    setPasswords(updatedPasswords);
  };

  // Yeni şifre ekleme
  const handleAdd = () => {
    if (newPassword.password_name && newPassword.secure_password) {
      const newId = passwords.length ? passwords[passwords.length - 1].id + 1 : 1; // Yeni ID oluşturma
      const updatedPasswords = [...passwords, { ...newPassword, id: newId, isEditable: false, isPasswordVisible: false }];
      setPasswords(updatedPasswords);
      setNewPassword({ password_name: '', secure_password: '' }); // Formu temizle
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

        {/* Yeni şifre ekleme formu */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={newPassword.password_name}
            onChange={(e) => setNewPassword({ ...newPassword, password_name: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Password"
            value={newPassword.secure_password}
            onChange={(e) => setNewPassword({ ...newPassword, secure_password: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleAdd} style={{ padding: '10px 20px', borderRadius: '6px', backgroundColor: '#4CAF50', color: 'white' }}>Add</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Information</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {passwords.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  {item.isEditable ? (
                    <input
                      type="text"
                      value={item.password_name}
                      onChange={(e) => {
                        const updatedPasswords = passwords.map(password =>
                          password.id === item.id ? { ...password, password_name: e.target.value } : password
                        );
                        setPasswords(updatedPasswords);
                      }}
                      style={{
                        width: '150px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc'
                      }}
                    />
                  ) : (
                    item.password_name
                  )}
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
                        <button onClick={() => handleSave(item.id, item.secure_password, item.password_name)}>
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
      </div>
    </div>
  );
};

export default MyAccount;