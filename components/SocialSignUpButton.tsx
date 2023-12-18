import { FC, ReactNode } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

interface SocialSignUpButtonProps {
  children: ReactNode;
  socialProvider: string
}
const SocialSignUpButton: FC<SocialSignUpButtonProps> = ({ socialProvider, children }) => {
  const signUpWithSocialProvider = () => signIn(socialProvider, { callbackUrl: 'http://localhost:3000'});

  return (
    <Button onClick={signUpWithSocialProvider} className='w-full mb-2'>
      {children}
    </Button>
  );
};

export default SocialSignUpButton;
