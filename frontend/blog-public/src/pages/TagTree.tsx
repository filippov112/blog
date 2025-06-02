import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type TagNode = {
  id: number;
  name: string;
  path: string;
  children: TagNode[];
};

const TagTree = () => {
  const [tree, setTree] = useState<TagNode[]>([]);

  useEffect(() => {
    fetch('https://localhost:7284/api/Public/tags')
      .then(res => res.json())
      .then(data => setTree(data));
  }, []);

  const renderNode = (node: TagNode) => (
    <li key={node.id}>
      <Link to={`/tag/${encodeURIComponent(node.path)}`}>{node.name}</Link>
      {node.children?.length > 0 && (
        <ul>
          {node.children.map(child => renderNode(child))}
        </ul>
      )}
    </li>
  );

  return (
    <div>
      <h3>Навигация по тегам</h3>
      <ul>
        {tree.map(node => renderNode(node))}
      </ul>
    </div>
  );
};

export default TagTree;
