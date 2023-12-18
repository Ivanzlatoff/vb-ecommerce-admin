import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


async function HomeLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: session.user.id
    }
  });

  if (store) {
    redirect(`/${store.id}`)
  }

  return (
    <>
      {children}
    </>
  )
}

export default HomeLayout
