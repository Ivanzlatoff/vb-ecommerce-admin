import { FC, ReactNode } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

interface SocialSignInButtonProps {
  socialProvider: string;
  children: ReactNode;
}
// const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
//   const loginWithGoogle = () => signIn('google', { callbackUrl: 'http://localhost:3000'});

//   return (
//     <Button onClick={loginWithGoogle} className='w-full mb-2'>
//       {children}
//     </Button>
//   );
// };

// export default GoogleSignInButton;

const SocialSignInButton: FC<SocialSignInButtonProps> = ({ socialProvider, children }) => {
  const loginWithSocialProvider = () => signIn(socialProvider, { callbackUrl: 'http://localhost:3000'});

  return (
    <Button onClick={loginWithSocialProvider} className='w-full mb-2'>
      {children}
    </Button>
  );
};

export default SocialSignInButton;