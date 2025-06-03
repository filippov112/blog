import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/posts/new');
    } else {
      alert('Ошибка входа');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Вход</h2>
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={e => setUsername(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />
      <div>
        <button onClick={handleLogin}>Войти</button><br />
        <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default LoginPage;
