import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('https://localhost:7284/api/Auth/login', {
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
      <button onClick={handleLogin}>Войти</button>
    </div>
  );
};

export default LoginPage;
