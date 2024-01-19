import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className='h-screen flex items-center justify-center
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
     from-slate-400 to-slate-800'>
      {children}
    </div>
  );
};

export default AuthLayout;
