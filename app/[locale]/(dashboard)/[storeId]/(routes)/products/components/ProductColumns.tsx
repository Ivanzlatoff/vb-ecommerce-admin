"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { Category } from "@prisma/client";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  description: string
  price: string
  size: string
  categories: Category[]
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header:"Name",
  },
  {
    accessorKey: "description",
    header: "Descriprion",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.description.substring(0,10)}...
      </div>
    )
  },
  {
    accessorKey: "isArchived",
    header:"Archived",
  },
  {
    accessorKey: "isFeatured",
    header:"Featured",
  },
  {
    accessorKey: "price",
    header:"Price",
  }, 
  {
    accessorKey: "categories",
    header:"Categories",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.categories.map((item) => item.name).join(', ')}
      </div>
    )
  },
  {
    accessorKey: "size",
    header:"Size",
  },
  {
    accessorKey: "color",
    header:"Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div 
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
