import Link from "next/link";
import { redirect } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";

import { Button, buttonVariants } from "./ui/button";
import { UserAccountNav } from "./UserAccountNav";
import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth } from "@/auth";
import { useStores } from "@/app/[locale]/hooks/use-stores";
import { LanguageChanger } from "./LanguageChanger";
import initTranslations from "@/app/i18n";
import { Separator } from "./ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";



interface NavbarProps {
  newOrders: number,
  locale: string
}

const Navbar: React.FC<NavbarProps> = async ({
  newOrders,
  locale
}) => {
  const { t } = await initTranslations({
    locale,
    namespaces: ['common']
  });

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect('/auth/login');
  }

  const stores = await useStores(userId);

  return (
    <div className='flex-col'>
      <div className='sm:flex justify-center flex-row items-center px-4 space-y-2 sm:space-y-0 pt-2'>
      <div className="flex justify-center mr-2">
        <StoreSwitcher items={stores} className="m-auto" />
      </div>
        <MainNav newOrders={newOrders || 0} className="md:block hidden m-auto"/>
        <div className='flex items-center justify-center space-x-4 ml-auto'>
          <div className="md:hidden block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-slate-400">
                  <RxHamburgerMenu size={30} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <MainNav newOrders={newOrders || 0} className="flex-col items-start" />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <LanguageChanger />
          <ThemeToggle />
          {session?.user ? (
            <UserAccountNav />
          ) : (
            <Link className={buttonVariants()} href="/auth/login">
              {t('sign_in')}
            </Link>
          )}
        </div>
      </div>
      <Separator className="mt-2" />
    </div>
  )
}

export default Navbar
