interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  children: React.ReactNode;
}
 
export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200'
  };
 
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};