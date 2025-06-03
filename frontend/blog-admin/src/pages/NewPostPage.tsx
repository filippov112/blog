import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (!token) {
      alert('Требуется авторизация');
      navigate('/login');
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert('Заголовок и содержимое обязательны');
      return;
    }

    // Преобразование строки тегов в массив строк
    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // 1. Отправка поста
    const res = await fetch(`${API_BASE}/Post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        contentMarkdown: content,
        tags: tagsArray,
      }),
    });

    if (!res.ok) {
      alert('Ошибка создания поста');
      return;
    }

    const { id } = await res.json();

    // 2. Загрузка обложки
    if (coverImage) {
      const formData = new FormData();
      formData.append('file', coverImage);
      const resCover = await fetch(`${API_BASE}/Attachment/cover/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!resCover.ok) {
        alert('Ошибка загрузки обложки');
        return;
      }
    }

    // 3. Загрузка вложений
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
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
    setTagsInput('');
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
        type="file"
        accept="image/*"
        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
        style={{ marginBottom: '1rem' }}
      />
      <input
        placeholder="Теги через запятую (например: #Новости#Спорт#Футбол, #Погода)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
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
