import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

type Attachment = {
  fileName: string;
  fileType: string;
  url: string;
};

type Post = {
  id: number;
  title: string;
  contentMarkdown: string;
  attachments: Attachment[];
  coverImageUrl?: string;
};


const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/Public/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [id]);

  if (!post) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt="Обложка"
          style={{ maxWidth: '100%', marginBottom: '1rem' }}
        />
      )}
      <h2>{post.title}</h2>
      <ReactMarkdown>{post.contentMarkdown}</ReactMarkdown>
      <h3>Вложения:</h3>
      <ul>
        {post.attachments.map((att, i) => (
          <li key={i}>
            <a href={att.url} target="_blank" rel="noopener noreferrer">
              {att.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostPage;
