import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

type TagNode = {
  id: number;
  name: string;
  children: TagNode[];
};

const TagTree = () => {
  const [tree, setTree] = useState<TagNode[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/Public/tags`)
      .then(res => res.json())
      .then(data => setTree(data));
  }, []);

  const renderNode = (node: TagNode, pref: string) => (
    <li key={node.id}>
      <Link to={`/tag/${pref}${encodeURIComponent(node.name)}`}>{node.name}</Link>
      {node.children?.length > 0 && (
        <ul>
          {node.children.map(child => renderNode(child, node.name + `/`))}
        </ul>
      )}
    </li>
  );

  return (
    <div>
      <h3>Навигация по тегам</h3>
      <ul>
        {tree.map(node => renderNode(node, ""))}
      </ul>
    </div>
  );
};

export default TagTree;
