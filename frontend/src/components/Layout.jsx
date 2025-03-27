import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:8000/api/accounts/user/', {
          headers: { 'Authorization': `Token ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => console.error('ユーザー情報の取得に失敗しました:', err));
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("既にログアウト済みです");
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/accounts/logout/', 
        {},
        {
          headers: { 'Authorization': `Token ${token}` },
        }
      );

      localStorage.removeItem('token');
      navigate('/'); // ログインページへリダイレクト
    } catch (err) {
      console.error("ログアウトに失敗しました:", err);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("ログインしていません");
      return;
    }

    const confirmDelete = window.confirm("本当にアカウントを削除しますか？\nこの操作は取り消せません。");
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/accounts/delete/', 
        {},
        {
          headers: { 'Authorization': `Token ${token}` },
        }
      );

      localStorage.removeItem('token');
      navigate('/'); // ログインページへリダイレクト
    } catch (err) {
      console.error("アカウント削除に失敗しました:", err);
    }
  };

  return (
    <div className="layout-container">
      <header className="header">
        <h2>RagChatBot</h2>
        {user && (
          <div className="user-profile">
            <button
              className='username-button'
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {user.username}
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="logout-button" onClick={handleLogout}>
                  ログアウト
                </button>
                <button className="delete-account-button" onClick={handleDelete}>
                  アカウント削除
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
