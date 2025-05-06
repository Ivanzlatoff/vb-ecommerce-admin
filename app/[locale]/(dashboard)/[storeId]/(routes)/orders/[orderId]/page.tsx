import initTranslations from "@/app/i18n";
import prismadb from "@/lib/prismadb"
import OrderDetails from "./components/OrderDetails";
import { OrderItemColumn, columns } from "./components/OrderItemColumn";
import { DataTable } from "@/components/ui/data-table";
import Currency from "@/components/ui/Currency";
import OrderStatus from "./components/OrderStatus";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";


const OrderPage = async ({
  params
}: {
  params: { orderId: string, storeId: string, locale: string }
}) => {
  const { orderId, storeId, locale } = await Promise.resolve(params);
  const { t } = await initTranslations({
    locale: locale,
    namespaces: ['orders']
  });

  const order = await prismadb.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              color: true
            }
          },
        }
      },
    },
  });

  const formattedOrderItem: OrderItemColumn[] = order!.orderItems.map((item) => ({
    productName: item.product.name,
    productColorName: item.product.color.name,
    productColorValue: item.product.color.value,
    productPrice: Number(item.product.price),
    quantity: Number(item.quantity),
    totalPrice: Number(item.product.price) * Number(item.quantity)
  }));

  return (
    <div className="p-10">
      <RoleGate allowedRole={UserRole.ADMIN}>
        {order &&
        <>
          <OrderDetails 
            id={order!.id}
            createdAt={order!.createdAt}
            name={order!.name}
            email={order!.email}
            phone={order!.phone}
            address={order!.address}
            isPaid={order!.isPaid}
          />
          <div className="sm:flex flex-row justify-between my-5">
            <div className="flex justify-between space-x-5 items-center">
              <h1 className="font-semibold text-lg">{t('grand_total')}:</h1>
              <Currency value={order.orderItems.reduce((total, item) => {
                return total + (Number(item.product.price) * Number(item.quantity))
              }, 0 )} />
            </div>
            <OrderStatus status={order.status} />
          </div>
          <DataTable searchKey="productName" columns={columns} data={formattedOrderItem} />
        </>}
      </RoleGate>
    </div>
  )
}

export default OrderPage;