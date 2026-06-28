import { PostCard } from '../molecules/PostCard';

interface Post {
  _id: string;
  titulo?: string;
  title?: string;
  content: string;
  authorId: string;
}

interface PostFeedProps {
  posts: Post[];
  isAuthenticated: boolean;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  isAuthenticated,
  onEdit,
  onDelete
}) => {
  return (
    <div>
      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-4">Feed</p>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Publicaciones</h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            No hay publicaciones aún. Sé el primero en crear una.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isAuthenticated={isAuthenticated}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};