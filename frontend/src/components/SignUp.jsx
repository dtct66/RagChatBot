import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/auth.css';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false)
      return;
    }

    try {
  
      const response = await axios.post("http://localhost:8000/api/accounts/signup/", {
        username,
        password,
        password2: confirmPassword, 
      });

      if (response.status === 200) {
        const token = response.data.Token;
        localStorage.setItem("token", token);
        navigate("/chat");
      }
    } catch(err) {
      setError("サインアップに失敗しました");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup} className="auth-form">
        <h2>サインアップ</h2>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="確認用パスワード"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">サインアップ</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
      <div className="signup-link">
        <p>すでにアカウントをお持ちですか？</p>
        <button onClick={() => navigate("/")}>ログイン</button>
      </div>
    </div>
  );
};

export default SignUp;
