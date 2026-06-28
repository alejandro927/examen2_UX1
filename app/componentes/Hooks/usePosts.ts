import { useState, useEffect } from 'react';

interface Post {
  _id: string;
  titulo?: string;
  title?: string;
  content: string;
  authorId: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [titulo, setTitulo] = useState('');
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cargarPosts = async () => {
    try {
      const res = await fetch('http://localhost:3001/listPost');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
    }
  };

  useEffect(() => {
    cargarPosts();
  }, []);

  const handlePostSubmit = async (userUID: string | null) => {
    if (!userUID) {
      alert('Por favor, inicia sesión para realizar esta acción.');
      return;
    }

    setIsLoading(true);
    try {
      let url = 'http://localhost:3001/createPost';
      let method = 'POST';
      
      if (editingPostId) {
        url = `http://localhost:3001/editPost/${editingPostId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          content,
          authorId: userUID
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(editingPostId ? '¡Post actualizado de forma exitosa!' : '¡Post creado y publicado en MongoDB!');
        limpiarFormulario();
        await cargarPosts();
        return true;
      } else {
        alert(`Error: ${data.msj}`);
        return false;
      }
    } catch (error) {
      alert('Ocurrió un error de red al intentar guardar el post.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    const confirmar = confirm('¿Estás completamente seguro de que deseas eliminar este post?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/deletePost/${postId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.msj);
        await cargarPosts();
        if (editingPostId === postId) limpiarFormulario();
        return true;
      } else {
        alert(`Error: ${data.msj}`);
        return false;
      }
    } catch (error) {
      alert('Error de red al intentar eliminar el elemento.');
      return false;
    }
  };

  const seleccionarParaEditar = (post: Post) => {
    setEditingPostId(post._id);
    setTitulo(post.titulo || post.title || '');
    setContent(post.content);
  };

  const limpiarFormulario = () => {
    setEditingPostId(null);
    setTitulo('');
    setContent('');
  };

  return {
    posts,
    titulo,
    content,
    editingPostId,
    isLoading,
    setTitulo,
    setContent,
    handlePostSubmit,
    handleDelete,
    seleccionarParaEditar,
    limpiarFormulario,
    cargarPosts
  };
};