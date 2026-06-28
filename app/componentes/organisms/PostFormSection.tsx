import { PostForm } from '../molecules/PostForm';

interface PostFormSectionProps {
  titulo: string;
  content: string;
  editingPostId: string | null;
  isAuthenticated: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onTituloChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export const PostFormSection: React.FC<PostFormSectionProps> = ({
  titulo,
  content,
  editingPostId,
  isAuthenticated,
  onSubmit,
  onCancel,
  onTituloChange,
  onContentChange
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-amber-50 p-6 rounded-lg border-t-4 border-amber-600 shadow-sm mb-8">
      <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">
        {editingPostId ? 'Modo Edición' : 'Nueva Publicación'}
      </p>
      <h2 className={`text-xl font-semibold mb-4 ${editingPostId ? 'text-amber-700' : 'text-gray-900'}`}>
        {editingPostId ? 'Modificar Post' : 'Crear Nueva Publicación'}
      </h2>
      
      <PostForm
        titulo={titulo}
        content={content}
        isEditing={!!editingPostId}
        isDisabled={!isAuthenticated}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onTituloChange={onTituloChange}
        onContentChange={onContentChange}
      />
    </div>
  );
};