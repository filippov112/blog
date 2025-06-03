import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NewPostPage from './pages/NewPostPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/new" element={<NewPostPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}


export default App;

