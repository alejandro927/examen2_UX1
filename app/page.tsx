'use client';

import { MainTemplate } from './componentes/templates/MainTemplate'
import { AuthSection } from './componentes/organisms/AuthSection';
import { PostFormSection } from './componentes/organisms/PostFormSection';
import { PostFeed } from './componentes/organisms/PostFeed';
import { useAuth } from './componentes/Hooks/useAuth';
import { usePosts } from './componentes/Hooks/usePosts';

export default function Home() {
  const { userUID, isLoading: authLoading, handleRegister, handleLogin, handleLogout } = useAuth();
  const {
    posts,
    titulo,
    content,
    editingPostId,
    setTitulo,
    setContent,
    handlePostSubmit,
    handleDelete,
    seleccionarParaEditar,
    limpiarFormulario
  } = usePosts();

  const onPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePostSubmit(userUID);
  };

  return (
    <MainTemplate>
      {/* Sección de Autenticación */}
      <section className="mb-10">
        <AuthSection
          userUID={userUID}
          onRegister={handleRegister}
          onLogin={handleLogin}
          onLogout={handleLogout}
          isRegistering={authLoading}
          isLoggingIn={authLoading}
        />
      </section>

      {/* Sección de Formulario de Posts */}
      <section className="mb-10">
        <PostFormSection
          titulo={titulo}
          content={content}
          editingPostId={editingPostId}
          isAuthenticated={!!userUID}
          onSubmit={onPostSubmit}
          onCancel={limpiarFormulario}
          onTituloChange={setTitulo}
          onContentChange={setContent}
        />
      </section>

      {/* Sección de Feed */}
      <section>
        <PostFeed
          posts={posts}
          isAuthenticated={!!userUID}
          onEdit={seleccionarParaEditar}
          onDelete={handleDelete}
        />
      </section>
    </MainTemplate>
  );
}

/*"use client";

import { useState, useEffect } from "react";

// Interfaz adaptada a la estructura de MongoDB e imágenes compartidas
interface Post {
  _id: string;
  titulo?: string;
  title?: string; // Mapeado por el campo "title" que usa tu backend al editar
  content: string;
  authorId: string;
}

export default function Home() {
  // Estados para Registro Avanzado (Vinculado a tu nuevo backend con MongoDB)
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");

  // Estados para Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [userUID, setUserUID] = useState<string | null>(null);

  // Estados para el CRUD de Posts
  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null); // null = Crear, ID = Editar

  // Lista de posts obtenidos de la Base de Datos
  const [posts, setPosts] = useState<Post[]>([]);

  // Al cargar el componente del cliente, lee la sesión persistente y carga los posts
  useEffect(() => {
    const savedUID = localStorage.getItem("userUID");
    if (savedUID) setUserUID(savedUID);
    cargarPosts();
  }, []);

  // GET: Obtener todos los posts de MongoDB
  const cargarPosts = async () => {
    try {
      const res = await fetch("http://localhost:3001/listPost");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error al cargar posts desde el servidor:", error);
    }
  };

  // POST / PUT: Manejador único del formulario de Posts
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUID) return alert("Por favor, inicia sesión para realizar esta acción.");

    if (editingPostId) {
      // ✏️ MODO EDITAR (PUT /editPost/:id)
      try {
        const res = await fetch(`http://localhost:3001/editPost/${editingPostId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: titulo, // Tu backend lee 'req.body.titulo' en el PUT
            content: content,
            authorId: userUID // Cambia el authorId por el ID del usuario que lo edita actualizándolo
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("¡Post actualizado de forma exitosa!");
          limpiarFormularioPost();
          cargarPosts();
        } else {
          alert(`Error: ${data.msj}`);
        }
      } catch (error) {
        alert("Ocurrió un error de red al intentar actualizar el post.");
      }
    } else {
      // ➕ MODO CREAR (POST /createPost)
      try {
        const res = await fetch("http://localhost:3001/createPost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: titulo,
            content: content,
            authorId: userUID
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("¡Post creado y publicado en MongoDB!");
          limpiarFormularioPost();
          cargarPosts();
        } else {
          alert(`Error: ${data.msj}`);
        }
      } catch (error) {
        alert("Ocurrió un error de red al intentar guardar el post.");
      }
    }
  };

  // 🗑️ ELIMINAR POST (DELETE /deletePost/:id)
  const handleScaleDelete = async (postId: string) => {
    const confirmar = confirm("¿Estás completamente seguro de que deseas eliminar este post?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/deletePost/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.msj); // Muestra el mensaje de éxito del backend
        cargarPosts(); // Refresca la interfaz
        if (editingPostId === postId) limpiarFormularioPost();
      } else {
        alert(`Error: ${data.msj}`);
      }
    } catch (error) {
      alert("Error de red al intentar eliminar el elemento.");
    }
  };

  // Carga la información de la tarjeta seleccionada de vuelta al formulario superior
  const seleccionarParaEditar = (post: Post) => {
    setEditingPostId(post._id);
    // Tu backend usa "titulo" en el post original pero "title" tras la actualización, manejamos ambas opciones de la DB:
    setTitulo(post.titulo || post.title || "");
    setContent(post.content);
  };

  const limpiarFormularioPost = () => {
    setEditingPostId(null);
    setTitulo("");
    setContent("");
  };

  // --- Funciones de Gestión de Autenticación (Firebase + MongoDB) ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          nombre,
          apellido,
          username
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`¡Usuario creado exitosamente! ID Mongo: ${data.idUsuarioMongo}`);
        setRegisterEmail("");
        setRegisterPassword("");
        setNombre("");
        setApellido("");
        setUsername("");
      } else {
        alert(`Fallo en el registro: ${data.msj}`);
      }
    } catch (error) {
      alert("Error al conectar con la pasarela de registro.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/logIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        const uid = data.response.user.uid;
        localStorage.setItem("userUID", uid);
        setUserUID(uid);
        alert("Autenticación completada. ¡Bienvenido de nuevo!");
        setLoginEmail("");
        setLoginPassword("");
      } else {
        alert(`Error al entrar: ${data.msj}`);
      }
    } catch (error) {
      alert("Error en el proceso de inicio de sesión.");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3001/logOut", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("userUID");
        setUserUID(null);
        limpiarFormularioPost();
        alert("Sesión finalizada de manera segura.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "900px", margin: "0 auto", color: "#333" }}>
      <h1 style={{ textAlign: "center" }}>Plataforma de Publicaciones - Evaluación 2</h1>
      <hr style={{ border: "0", height: "1px", background: "#ccc", margin: "1.5rem 0" }} />

      {/* SECCIÓN 1: LOGIN Y REGISTRO COMPLETO }
      <section style={{ marginBottom: "2.5rem" }}>
        {!userUID ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            {/* Formulario Registro Completo }
            <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>1. Crear una Cuenta</h2>
              <form onSubmit={handleRegister} style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ padding: "8px" }} />
                <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required style={{ padding: "8px" }} />
                <input type="text" placeholder="Nombre de Usuario (Username)" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: "8px" }} />
                <input type="email" placeholder="Correo electrónico" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required style={{ padding: "8px" }} />
                <input type="password" placeholder="Contraseña de Seguridad" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required style={{ padding: "8px" }} />
                <button type="submit" style={{ background: "#10b981", color: "#fff", border: "none", padding: "10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Registrar en Sistemas</button>
              </form>
            </div>

            {/* Formulario Login }
            <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>2. Acceso Autorizado</h2>
              <form onSubmit={handleLogin} style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <input type="email" placeholder="Correo electrónico" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={{ padding: "8px" }} />
                <input type="password" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={{ padding: "8px" }} />
                <button type="submit" style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Iniciar Sesión</button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", padding: "1rem", borderRadius: "6px", display: "flex", justifyContent: "between", alignItems: "center", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: "#065f46" }}>🟢 Estado: <strong>Usuario Conectado Firme</strong></p>
              <small style={{ color: "#047857" }}>Firebase Autenticación UID: <code>{userUID}</code></small>
            </div>
            <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>Desconectarse</button>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: FORMULARIO INTERACTIVO (CREAR / EDITAR) }
      <section style={{ background: "#f1f5f9", padding: "1.5rem", borderRadius: "8px", marginBottom: "2.5rem" }}>
        <h2 style={{ marginTop: 0, color: editingPostId ? "#b45309" : "#1e293b" }}>
          {editingPostId ? "⚠️ Panel de Modificación de Post" : "Crear Nueva Publicación en la Red"}
        </h2>
        <form onSubmit={handlePostSubmit} style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Escribe el título aquí..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
          />
          <textarea
            placeholder="Desarrolla el contenido del post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1", resize: "vertical" }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={!userUID}
              style={{
                flex: 2,
                padding: "12px",
                background: !userUID ? "#cbd5e1" : editingPostId ? "#d97706" : "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: userUID ? "pointer" : "not-allowed"
              }}
            >
              {!userUID ? "🔒 Requiere iniciar sesión" : editingPostId ? "Confirmar y Modificar Post" : "Subir a la Base de Datos"}
            </button>

            {editingPostId && (
              <button
                type="button"
                onClick={limpiarFormularioPost}
                style={{ flex: 1, background: "#64748b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </section>

      {/* SECCIÓN 3: FEED VISUAL CON ACCIONES DE MODIFICACIÓN Y BORRADO }
      <section>
        <h2>Feed de Publicaciones Globales</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.length === 0 ? (
            <p style={{ color: "#64748b", fontStyle: "italic" }}>No se encontraron posts registrados en la base de datos.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                {/* Imprime de manera inteligente tanto titulo como title según el estado de guardado del backend }
                <h3 style={{ margin: "0 0 10px 0", fontSize: "1.35rem", color: "#0f172a" }}>
                  {post.titulo || post.title || "Post sin título"}
                </h3>
                <p style={{ margin: "0 0 15px 0", color: "#334155", lineHeight: "1.5" }}>{post.content}</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px" }}>
                  <small style={{ color: "#64748b" }}>
                    Editor Responsable ID: <code style={{ background: "#e2e8f0", padding: "2px 4px", borderRadius: "3px" }}>{post.authorId}</code>
                  </small>

                  {/* Acciones del Feed condicionados a que el usuario esté logueado/}
                  {userUID && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => seleccionarParaEditar(post)}
                        style={{ background: "#f59e0b", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500" }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleScaleDelete(post._id)}
                        style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500" }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
*/