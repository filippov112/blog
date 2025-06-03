import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

type Post = {
  id: number;
  title: string;
};

const TagPage = () => {
  const location = useLocation();
  const path = decodeURIComponent(location.pathname.replace(/^\/tag\//, '')); // Новости/Спорт

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/Public/posts/bypath?path=${path}`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [path]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Посты по теме: {path}</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagPage;
