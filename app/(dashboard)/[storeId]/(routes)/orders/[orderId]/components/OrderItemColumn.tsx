"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"


export type OrderItemColumn = {
  productName: string,
  productColorName: string,
  productColorValue: string,
  productPrice: number,
  quantity: number,
  totalPrice: number
}

export const columns: ColumnDef<OrderItemColumn>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "productColorName",
    header:"Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div 
          className="h-6 w-6 rounded-full border" 
          style={{ backgroundColor: row.original.productColorValue }} 
        />
        {row.original.productColorName}
      </div>
    )
  },
  {
    accessorKey: "productPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price per kg" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity, kg" />
    ),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {Number(row.original.productPrice) * row.original.quantity}
      </div>
    )
  },
]