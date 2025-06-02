import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

type Post = {
  id: number;
  title: string;
  contentMarkdown: string;
  attachments: string[]; // URL'ы файлов
};

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`https://localhost:7284/api/Public/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [id]);

  if (!post) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{post.title}</h2>
      <ReactMarkdown>{post.contentMarkdown}</ReactMarkdown>
      <h3>Вложения:</h3>
      <ul>
        {post.attachments.map((url, i) => (
          <li key={i}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
        ))}
      </ul>
    </div>
  );
};

export default PostPage;
