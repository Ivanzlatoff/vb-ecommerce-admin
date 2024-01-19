import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "./ui/button";
import { UserAccountNav } from "./UserAccountNav";
import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth } from "@/auth";
import { useStores } from "@/app/hooks/use-stores";


interface NavbarProps {
  newOrders: number
}

const Navbar: React.FC<NavbarProps> = async ({
  newOrders
}) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect('/auth/login');
  }

  const stores = await useStores(userId);

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
            <Link className={buttonVariants()} href="/auth/login">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
