"use client";

import { useState, useEffect } from "react";

interface Post {
  _id: string;
  titulo: string;
  content: string;
  authorId: string;
}

export default function Home() {
  // Estados para Login y Registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userUID, setUserUID] = useState<string | null>(null);

  // Estados para crear Post
  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedUID = localStorage.getItem("userUID");
    if (savedUID) setUserUID(savedUID);
    cargarPosts();
  }, []);

  const cargarPosts = async () => {
    try {
      const res = await fetch("http://localhost:3001/listPost");
      const data = await res.json();
      if (res.ok) setPosts(data.posts);
    } catch (error) {
      console.error("Error al cargar posts:", error);
    }
  };

  // 🔥 NUEVA FUNCIÓN: Registrar Usuario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("¡Usuario creado con éxito! Ahora puedes iniciar sesión.");
        setEmail("");
        setPassword("");
      } else {
        alert(`Error al registrar: ${data.msj}`);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/logIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        const uid = data.response.user.uid;
        localStorage.setItem("userUID", uid);
        setUserUID(uid);
        alert("¡Sesión iniciada!");
        setEmail("");
        setPassword("");
      } else {
        alert(`Error: ${data.msj || "Credenciales incorrectas"}`);
      }
    } catch (error) {
      alert("Error al iniciar sesión.");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3001/logOut", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("userUID");
        setUserUID(null);
        alert("Sesión cerrada.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUID) return alert("Inicia sesión primero.");

    try {
      const res = await fetch("http://localhost:3001/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, content, authorId: userUID }),
      });
      if (res.ok) {
        alert("¡Post creado!");
        setTitulo("");
        setContent("");
        cargarPosts();
      }
    } catch (error) {
      alert("Error al crear post.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Examen 2 - Plataforma de Posts</h1>
      <hr />

      {/* SECCIÓN DE AUTENTICACIÓN */}
      <section style={{ margin: "2rem 0" }}>
        {!userUID ? (
          <div style={{ display: "flex", gap: "40px" }}>
            {/* FORMULARIO DE REGISTRO */}
            <div>
              <h2>1. Registrarse</h2>
              <form onSubmit={handleRegister} style={{ display: "flex", gap: "10px", flexDirection: "column", width: "250px" }}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" style={{ backgroundColor: "#4ade80", border: "none", padding: "8px", cursor: "pointer" }}>Crear Cuenta</button>
              </form>
            </div>

            {/* FORMULARIO DE LOGIN */}
            <div>
              <h2>2. Ingresar</h2>
              <form onSubmit={handleLogin} style={{ display: "flex", gap: "10px", flexDirection: "column", width: "250px" }}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" style={{ backgroundColor: "#60a5fa", border: "none", padding: "8px", cursor: "pointer" }}>Iniciar Sesión</button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: "#cf6706", padding: "1rem", borderRadius: "5px" }}>
            <p>🟢 Autenticado con UID: <strong>{userUID}</strong></p>
            <button style={{ cursor: "pointer" }} onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}
      </section>

      <hr />

      {/* SECCIÓN PARA CREAR POSTS */}
      <section style={{ margin: "2rem 0" }}>
        <h2>Crear Nuevo Post</h2>
        <form onSubmit={handleCreatePost} style={{ display: "flex", gap: "10px", flexDirection: "column", width: "400px" }}>
          <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          <textarea placeholder="Contenido..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} required />
          <button type="submit" disabled={!userUID}>Publicar Post</button>
        </form>
      </section>

      <hr />

      {/* SECCIÓN DE LISTADO */}
      <section style={{ margin: "2rem 0" }}>
        <h2>Feed de Publicaciones</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {posts.map((post) => (
            <div key={post._id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "5px" }}>
              <h3>{post.titulo}</h3>
              <p>{post.content}</p>
              <small style={{ color: "#666" }}>Autor UID: <code>{post.authorId}</code></small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}