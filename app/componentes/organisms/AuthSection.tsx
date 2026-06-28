import { AuthForm } from '../molecules/AuthForm';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

interface AuthSectionProps {
  userUID: string | null;
  onRegister: (data: any) => void;
  onLogin: (data: any) => void;
  onLogout: () => void;
  isRegistering?: boolean;
  isLoggingIn?: boolean;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  userUID,
  onRegister,
  onLogin,
  onLogout,
  isRegistering = false,
  isLoggingIn = false
}) => {
  if (userUID) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-white border-l-4 border-emerald-600 p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge variant="success">Usuario Conectado</Badge>
            <p className="text-sm text-gray-600 mt-2">
              Firebase UID: <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{userUID}</code>
            </p>
          </div>
          <Button variant="danger" size="md" onClick={onLogout}>
            Desconectarse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-6">Autenticación</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg border-t-4 border-blue-600 shadow-sm hover:shadow-md transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Crear una Cuenta</h2>
          <AuthForm type="register" onSubmit={onRegister} isLoading={isRegistering} />
        </div>
        
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg border-t-4 border-blue-500 shadow-sm hover:shadow-md transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceso Autorizado</h2>
          <AuthForm type="login" onSubmit={onLogin} isLoading={isLoggingIn} />
        </div>
      </div>
    </div>
  );
};