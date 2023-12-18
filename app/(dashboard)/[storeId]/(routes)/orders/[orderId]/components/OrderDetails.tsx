"use client";

import { format } from "date-fns";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { OrderStatus } from "@prisma/client";


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

  return (
    <>
      <div className="flex justify-between text-xl pb-5 items-center">
        <div className="flex space-x-5">
          <h1 className="font-bold">Order Id:</h1>
          <p>{id}</p>
        </div>
        <div className="flex space-x-3">
          <h1 className="font-bold">Created:</h1>
          <i>{format(createdAt, "MMMM do, yyyy")}</i>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between my-5">
        <Heading
          title={name}
          description="Order details"
        />
        <div>
          <h1>Email: {email}</h1>
          <h1>Phone: {phone}</h1>
        </div>
        <div>
          <h1>Address: {address}</h1>
          <h1>Paid: {isPaid ? "Yes" : "No"}</h1>
        </div>
      </div>
      <Separator />
    </>
  )
}

export default OrderDetails;
