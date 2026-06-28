import { Input } from '../atoms/Input';
import { TextArea } from '../atoms/TextArea';
import { Button } from '../atoms/Button';

interface PostFormProps {
  titulo: string;
  content: string;
  isEditing: boolean;
  isDisabled: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onTituloChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  titulo,
  content,
  isEditing,
  isDisabled,
  onSubmit,
  onCancel,
  onTituloChange,
  onContentChange
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        placeholder="Escribe el título aquí..."
        value={titulo}
        onChange={(e) => onTituloChange(e.target.value)}
        fullWidth
        required
      />
      
      <TextArea
        placeholder="Desarrolla el contenido del post..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        rows={4}
        fullWidth
        required
      />
      
      <div className="flex gap-2">
        <Button
          type="submit"
          variant={isEditing ? 'warning' : 'primary'}
          fullWidth={!isEditing}
          disabled={isDisabled}
        >
          {isDisabled ? '🔒 Requiere iniciar sesión' : isEditing ? 'Confirmar y Modificar Post' : 'Subir a la Base de Datos'}
        </Button>
        
        {isEditing && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar Edición
          </Button>
        )}
      </div>
    </form>
  );
};