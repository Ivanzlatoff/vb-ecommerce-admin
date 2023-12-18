import SignInForm from '@/components/form/SignInForm';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className='w-full'>
      <SignInForm />
    </div>
  );
};

export default page;
