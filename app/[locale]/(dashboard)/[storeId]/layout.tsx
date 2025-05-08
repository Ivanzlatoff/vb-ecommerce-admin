import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/Navbar';


export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string, storeId: string }>
}) {
  const session = await auth();
  const { locale, storeId } = await Promise.resolve(params);
  if (!session?.user) {
    redirect('/auth/login')
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId: session?.user.id
    }
  });

  if (!store) {
    redirect('/');
  }

  const orders = await prismadb.order.findMany({
    where: {
      storeId: store.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const newOrders: number = orders.reduce((total, order) => {
    return total + (order.status === "PENDING" ? 1 : 0);
  }, 0);

  return (
    <>
      <Navbar locale={locale} newOrders={newOrders} />
      {children}
    </>
  )
}


