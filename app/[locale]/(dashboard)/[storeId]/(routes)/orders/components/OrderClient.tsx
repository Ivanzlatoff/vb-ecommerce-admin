"use client";

import { useTranslation } from "react-i18next";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrderColumn, columns } from "./OrderColumns";
import ApiList from "@/components/ui/ApiList";


interface OrderClientProps {
  data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
  const { t } = useTranslation(['dashboard']);
  return (
    <>
      <Heading 
        title={`${t('orders')} (${data.length})`}
        description={t('manage_orders')}
      />
      <Separator />
      <DataTable 
        searchKey="products" 
        columns={columns} 
        data={data} 
      />
      <Heading 
        title="API"
        description={t('api_calls')}
      />
      <Separator />
      <ApiList entityName="orders" entityIdName="orderId" />
    </>
  );
}

export default OrderClient;
