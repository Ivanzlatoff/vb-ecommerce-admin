import prismadb from "@/lib/prismadb";


export const useStores = async ( userId: string) => {

  const stores = await prismadb.store.findMany({
    where: {
      userId
    },
  });

  return stores;
};
