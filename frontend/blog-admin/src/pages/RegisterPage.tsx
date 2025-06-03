import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert('Ошибка регистрации');
      return;
    }

    // авторизация после регистрации
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      localStorage.setItem('token', data.token);
      navigate('/posts/new');
    } else {
      alert('Ошибка автоматической авторизации');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Регистрация</h2>
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleRegister}>Зарегистрироваться</button><br />
      <Link to="/login">Уже есть аккаунт? Войти</Link>
    </div>
  );
};

export default RegisterPage;
