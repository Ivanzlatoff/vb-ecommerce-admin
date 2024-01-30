"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react'
import { useTranslation } from 'react-i18next';


interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  newOrders: number;
}

const MainNav: React.FC<MainNavProps> = ({
  className,
  newOrders,
  ...props
}) => {
  const { t, i18n } = useTranslation(['main-nav']);
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: t('overview'),
      active: pathname === `/${i18n.language}/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: t('billboards'),
      active: pathname === `/${i18n.language}/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: t('categories'),
      active: pathname === `/${i18n.language}/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: t('sizes'),
      active: pathname === `/${i18n.language}/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: t('colors'),
      active: pathname === `/${i18n.language}/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: t('products'),
      active: pathname === `/${i18n.language}/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: (
        <div className='inline-flex justify-center items-center'>
          <span>
            {t('orders')}
          </span>
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
      active: pathname === `/${i18n.language}/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: t('settings'),
      active: pathname === `/${i18n.language}/${params.storeId}/settings`,
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
            route.active ? "text-black font-bold dark:text-white" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export default MainNav;
