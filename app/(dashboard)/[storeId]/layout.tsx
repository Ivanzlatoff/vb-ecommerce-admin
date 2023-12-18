import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/Navbar';


async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: session.user.id
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
      <Navbar newOrders={newOrders} />
      {children}
    </>
  )
}

export default DashboardLayout

