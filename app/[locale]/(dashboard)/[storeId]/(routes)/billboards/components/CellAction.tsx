"use client";

import { useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from "axios";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/AlertModal";
import { BillboardColumn } from "./BillboardColumns";
import { useTranslation } from "react-i18next";


interface CellActionsProps {
  data: BillboardColumn
}

const CellAction: React.FC<CellActionsProps> = ({
  data
}) => {
  const { t } = useTranslation(['dashboard']);
  const router = useRouter();
  const params = useParams();

  const { data: session } = useSession();
  const userId = session?.user.id;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(t('billboard_id_copied'));
  };

  const onDelete = async () => {
    if (userId) {
      try {
          setLoading(true);
        await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
        router.refresh();
        toast.success(t('billboard_deleted'))
      } catch (error) {
        toast.error(t('billboard_deleted_error'))
      } finally {
        setLoading(false)
        setOpen(false)
      }
   } else {
    redirect("/auth/sign-in")
   }
  };

  return (
    <>
    <AlertModal 
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Opne menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t('actions')}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4"/>
            {t('copy_id')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            {t('update')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default CellAction;
