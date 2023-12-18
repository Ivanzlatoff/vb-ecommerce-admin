import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authOptions } from '@/lib/auth';
import { buttonVariants } from "./ui/button";
import { UserAccountNav } from "./UserAccountNav";
import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "@/components/ThemeToggle";


interface NavbarProps {
  newOrders: number
}

const Navbar: React.FC<NavbarProps> = async ({
  newOrders
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.userId;

  if (!userId) {
    redirect('/auth/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher items={stores} />
        <MainNav newOrders={newOrders || 0} className="mx-6"/>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeToggle />
          {session?.user ? (
            <UserAccountNav />
          ) : (
            <Link className={buttonVariants()} href="/auth/sign-in">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
