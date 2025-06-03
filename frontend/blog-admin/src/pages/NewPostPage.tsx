import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (!token) {
      alert('Требуется авторизация');
      navigate('/login');
      return;
    }

    // 1. Отправляем пост
    const res = await fetch(`${API_BASE}/Post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        contentMarkdown: content,
        tags: tags,
      }),
    });

    if (!res.ok) {
      alert('Ошибка создания поста');
      return;
    }

    const { id } = await res.json();

    // 2. Отправляем вложения
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }

      const uploadRes = await fetch(`${API_BASE}/Attachment/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        alert('Ошибка загрузки файлов');
        return;
      }
    }

    alert('Пост создан');
    setTitle('');
    setContent('');
    setTags('');
    setFiles(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Новый пост</h2>
      <input
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <textarea
        placeholder="Содержимое (markdown)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        placeholder="Теги (например: Новости#Спорт#Футбол)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        style={{ marginBottom: '1rem' }}
      />
      <button onClick={handleSubmit}>Создать пост</button>
    </div>
  );
};

export default NewPostPage;
