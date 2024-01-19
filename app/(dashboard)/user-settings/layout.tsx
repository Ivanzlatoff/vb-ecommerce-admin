import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import StoreSwitcher from '@/components/StoreSwitcher';
import { useStores } from '@/app/hooks/use-stores';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/auth/LogoutButton';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { UserAccountNav } from '@/components/UserAccountNav';


interface UserSettingsLayoutProps {
  children: React.ReactNode;
}

async function UserSettingsLayout({
  children,
}: UserSettingsLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login')
  };

  const stores = await useStores(session?.user.id);

  return (
    <div className='h-screen'>  
      <div className='flex flex-col sm:flex-row items-center justify-between w-full py-3 px-3 space-y-4'>
        <div className='flex flex-row space-x-5 items-center justify-between w-[280px]'>
          <UserAccountNav />
          <ThemeToggle />
          <Link href="/">
            <Home size={40} color='white' />
          </Link>
          <LogoutButton>
              <Button
                variant="destructive"
              >
                Sign Out
              </Button>
          </LogoutButton>
        </div>
        <div className=''>
          <StoreSwitcher items={stores} />
        </div>
      </div>
      <hr />
      <div className="flex items-center justify-center h-fit mt-20 p-5">
        {children}
      </div>
    </div>
  )
}

export default UserSettingsLayout;

