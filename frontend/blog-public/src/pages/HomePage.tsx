import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TagTree from './TagTree';

type Post = {
  id: number;
  title: string;
  createdAt: string;
};

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('https://localhost:7284/api/Public/posts?count=10')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div style={{ display: 'flex', padding: '2rem' }}>
      <div style={{ width: '250px', marginRight: '2rem' }}>
        <TagTree />
      </div>
      <div style={{ flexGrow: 1 }}>
        <h2>Последние посты</h2>
        <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{post.createdAt}</div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default HomePage;
