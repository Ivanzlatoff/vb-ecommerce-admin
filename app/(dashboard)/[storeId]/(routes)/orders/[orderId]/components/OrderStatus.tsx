"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { redirect, useParams, useRouter } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus as Status } from '@prisma/client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';


interface OrderStatusProps {
  status: Status
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  status
}) => {

  const params = useParams();
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState(status);
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (value: Status) => {
    setSelectedValue(value);
  };

  const { data: session } = useSession();
  const userId = session?.user.id;

  const handleSubmit = async (selectedValue: Status) => {
    if (userId) {
      try {
        setLoading(true);
        await axios.patch(`/api/${params.storeId}/orders/${params.orderId}`, { selectedValue })
        router.refresh();
        router.push(`/${params.storeId}/orders`);
        toast.success("Status updated.")
      } catch (error) {
        toast.error("Something went wrong.")
      } finally {
        setLoading(false)
      }
    } else {
      redirect("/auth/sign-in")
    }
  }

  return (
    <div className="flex justify-between items-center space-x-5 pr-10">
      {selectedValue !== status && 
      <Button
        disabled={loading}
        onClick={() => handleSubmit(selectedValue)}
      >
        Update Status
      </Button>}
      <h1 className="font-semibold text-lg">Status: </h1>
      <Select value={selectedValue} onValueChange={handleSelectChange}>
        <SelectTrigger   
          className={`${
            selectedValue === 'PENDING'
            ? 'bg-red-300 dark:text-red-700'
              : selectedValue === 'APPROVED'
              ? 'bg-yellow-300 dark:text-yellow-700'
              : selectedValue === 'SHIPPED'
              ? 'bg-blue-300 dark:text-blue-700'
              : selectedValue === 'DELIVERED'
              ? 'bg-green-300 dark:text-green-700'
              : ''
            } border-none border-white rounded-sm`}
          >
          <SelectValue defaultValue={selectedValue} />
        </SelectTrigger>
        <SelectContent className='pr-2'>
          <SelectItem value="PENDING" className="bg-red-300 m-2 dark:text-red-500">Pending</SelectItem>
          <SelectItem value="APPROVED" className="bg-yellow-300 m-2 dark:text-yellow-700">Approved</SelectItem>
          <SelectItem value="SHIPPED" className="bg-blue-300 m-2 dark:text-blue-700">Shipped</SelectItem>
          <SelectItem value="DELIVERED" className="bg-green-300 m-2 dark:text-green-700">Delivered</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default OrderStatus;