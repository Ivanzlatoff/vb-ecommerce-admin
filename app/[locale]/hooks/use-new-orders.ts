import prismadb from "@/lib/prismadb";


const useNewOrders = async (storeId: string) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const newOrders: number = orders.reduce((total, order) => {
    return total + (order.status === "PENDING" ? 1 : 0);
  }, 0);

  return newOrders;
};

export default useNewOrders;