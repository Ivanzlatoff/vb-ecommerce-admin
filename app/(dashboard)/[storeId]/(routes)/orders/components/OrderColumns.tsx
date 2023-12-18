"use client"

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { OrderStatus } from "@prisma/client";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string
  phone: string
  name: string
  isPaid: boolean
  totalPrice: string
  products: string
  status: OrderStatus
  quantities: string
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "status",
    header:"Status",
    cell: ({ row }) => (
      <div
        className={`${
          row.original.status === 'PENDING'
          ? 'bg-red-300'
            : row.original.status === 'APPROVED'
            ? 'bg-yellow-300'
            : row.original.status === 'SHIPPED'
            ? 'bg-blue-300'
            : row.original.status === 'DELIVERED'
            ? 'bg-green-300'
            : ''
          } border-4 border-white rounded-full p-2 flex justify-center items-center`}
      >
        {row.original.status}
      </div>
    )
  },
  {
    accessorKey: "products",
    header:"Products",
  },
  {
    accessorKey: "quantities",
    header:"Quantities, кг",
  },
  {
    accessorKey: "name",
    header:"Name",
  },
  {
    accessorKey: "phone",
    header:"Phone",
  },
  {
    accessorKey: "totalPrice",
    header:"Total Price",
  },
  {
    accessorKey: "isPaid",
    header:"Paid",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
