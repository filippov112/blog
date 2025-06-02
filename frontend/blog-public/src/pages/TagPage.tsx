import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

type Post = {
  id: number;
  title: string;
};

const TagPage = () => {
  const location = useLocation();
  const path = decodeURIComponent(location.pathname.replace(/^\/tag\//, '')); // Новости/Спорт

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`https://localhost:7284/api/Public/posts/bypath?path=${path}`)
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
