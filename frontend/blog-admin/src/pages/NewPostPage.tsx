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
        previewImageUrl: previewUrl.trim(),
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

  const handlePreviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔍 Проверка MIME-типа
    if (!file.type.startsWith("image/")) {
      alert("Можно загружать только изображения");
      return;
    }

    // 🧹 Удаление предыдущего preview, если был
    if (previewUrl) {
      try {
        const deleteUrl = `${API_BASE}/attachments?url=` + encodeURIComponent(previewUrl);
        await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      } catch (err) {
        console.warn("Ошибка при удалении старого preview", err);
      }
    }

    // ⬆ Загрузка нового файла
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/attachments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    if (!res.ok) {
      alert("Не удалось загрузить изображение");
      return;
    }

    const json = await res.json();
    setPreviewUrl(json.url);
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
