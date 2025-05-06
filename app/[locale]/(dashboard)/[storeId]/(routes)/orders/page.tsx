import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import OrderClient from "./components/OrderClient";
import { OrderColumn } from "./components/OrderColumns";
import { formatter } from "@/lib/utils";



const OrdersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const { storeId } = await Promise.resolve(params);
  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId
    },
    include: {
      orderItems: {
        include: {
          product: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    name: item.name,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    quantities: item.orderItems.map((orderItem) => orderItem.quantity).join(', '),
    isPaid: item.isPaid,
    status: item.status,
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + (Number(item.product.price) * Number(item.quantity))
    }, 0 )),
    createdAt: format(item.createdAt, "HH:mm MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage;
