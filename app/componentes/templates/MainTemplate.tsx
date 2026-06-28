interface MainTemplateProps {
  children: React.ReactNode;
  title?: string;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({ 
  children, 
  title = "Plataforma de Publicaciones" 
}) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Welcome Back! :3</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-400 mx-auto rounded-full"></div>
        </div>
        {children}
      </div>
    </main>
  );
};