import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import React, { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    username: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'register' && (
        <>
          <Input
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            required
          />
          <Input
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            fullWidth
            required
          />
          <Input
            name="username"
            placeholder="Nombre de Usuario"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
        </>
      )}
      
      <Input
        name="email"
        type="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
      />
      
      <Input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
      />
      
      <Button
        type="submit"
        variant={type === 'login' ? 'primary' : 'success'}
        fullWidth
        isLoading={isLoading}
      >
        {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
      </Button>
    </form>
  );
};