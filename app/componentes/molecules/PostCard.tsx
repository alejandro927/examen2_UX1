import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

interface Post {
  _id: string;
  titulo?: string;
  title?: string;
  content: string;
  authorId: string;
}

interface PostCardProps {
  post: Post;
  isAuthenticated: boolean;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isAuthenticated,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {post.titulo || post.title || 'Post sin título'}
      </h3>
      
      <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
      
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <Badge variant="neutral">
          ID: <code className="bg-gray-200 px-1 rounded text-xs">{post.authorId.slice(0, 8)}...</code>
        </Badge>
        
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button
              variant="warning"
              size="sm"
              onClick={() => onEdit(post)}
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(post._id)}
            >
              Eliminar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};