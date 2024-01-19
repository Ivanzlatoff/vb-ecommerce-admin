"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react'


interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  newOrders: number;
}

const MainNav: React.FC<MainNavProps> = ({
  className,
  newOrders,
  ...props
}) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: (
        <div className='flex justify-center items-center'>
          Orders
          {newOrders !== undefined && newOrders > 0 && (
            <span className={cn(
              "ml-2 bg-red-400 text-sm font-medium text-white rounded-full flex items-center justify-center h-[20px] w-[20px]",
              newOrders > 9 && "h-[24px] w-[24px]",
              newOrders > 99 && "h-[30px] w-[30px]",
            )}>
              {newOrders}
            </span>
          )}
        </div>
      ),
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
    },
  ];
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black font-bold dark:text-white" : "text-muted-foreground dark:text-zinc-400"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export default MainNav;
