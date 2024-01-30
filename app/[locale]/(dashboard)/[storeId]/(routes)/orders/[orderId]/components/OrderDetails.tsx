"use client";

import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";


interface OrderFormProps {
  id: string,
  createdAt: Date,
  name: string,
  email: string,
  phone: string,
  address: string,
  isPaid: boolean,
}

const OrderDetails: React.FC<OrderFormProps> = ({
  id,
  createdAt,
  name,
  email,
  phone,
  address,
  isPaid
}) => {
  const { t } = useTranslation(['orders'])
  return (
    <>
      <div className="sm:flex text-sm md:text-lg lg:text-xl flex-row justify-between pb-5 items-center">
        <div className="flex space-x-5">
          <h1 className="font-bold">{t('order_id')}:</h1>
          <p>{id}</p>
        </div>
        <div className="flex space-x-3">
          <h1 className="font-bold">{t('created')}:</h1>
          <i>{format(createdAt, "MMMM do, yyyy")}</i>
        </div>
      </div>
      <Separator />
      <div className="md:flex text-xs md:text-sm lg:text-lg flex-row items-center justify-between my-5 space-y-4">
        <Heading
          title={name}
          description={t('order_details')}
          className="text-lg md:text-xl lg:text-2xl"
        />
        <div>
          <h1>{t('email')}: {email}</h1>
          <h1>{t('phone')}: {phone}</h1>
        </div>
        <div>
          <h1>{t('address')}: {address}</h1>
          <h1>{t('paid')}: {isPaid ? t('yes') : t('no')}</h1>
        </div>
      </div>
      <Separator />
    </>
  )
}

export default OrderDetails;
