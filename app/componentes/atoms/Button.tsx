interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md',
    outline: 'bg-white border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};