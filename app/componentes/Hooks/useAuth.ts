import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [userUID, setUserUID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUID = localStorage.getItem('userUID');
    if (savedUID) setUserUID(savedUID);
  }, []);

  const handleRegister = async (data: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    username: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert(`¡Usuario creado exitosamente! ID Mongo: ${result.idUsuarioMongo}`);
        return true;
      } else {
        alert(`Fallo en el registro: ${result.msj}`);
        return false;
      }
    } catch (error) {
      alert('Error al conectar con la pasarela de registro.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/logIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        const uid = result.response.user.uid;
        localStorage.setItem('userUID', uid);
        setUserUID(uid);
        alert('Autenticación completada. ¡Bienvenido de nuevo!');
        return true;
      } else {
        alert(`Error al entrar: ${result.msj}`);
        return false;
      }
    } catch (error) {
      alert('Error en el proceso de inicio de sesión.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3001/logOut', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem('userUID');
        setUserUID(null);
        alert('Sesión finalizada de manera segura.');
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    userUID,
    isLoading,
    handleRegister,
    handleLogin,
    handleLogout
  };
};