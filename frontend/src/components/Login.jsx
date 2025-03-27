import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8000/api/accounts/login/", {
        username,
        password,
      });
      if (response.status === 200) {
        const token = response.data.Token;
        localStorage.setItem("token", token);
        navigate("/chat");
      }
    } catch (err) {
      setError("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup")
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>ログイン</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </form>
      <div className="signup-link">
        <p>アカウントをお持ちでないですか？</p>
        <button onClick={handleSignUpRedirect}>サインアップ</button>
      </div>
    </div>
  );
};

export default Login;
