import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";

import { redirect } from "next/navigation";


async function HomeLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login')
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
