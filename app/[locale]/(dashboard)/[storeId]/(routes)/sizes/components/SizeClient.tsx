"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/ApiList";

import { SizeColumn, columns } from "./SizeColumns";
import { useTranslation } from "react-i18next";


interface SizesClientProps {
  data: SizeColumn[]
}

const SizesClient: React.FC<SizesClientProps> = ({
  data
}) => {
  const { t } = useTranslation(['dashboard']);
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`${t('sizes')} (${data.length})`}
          description={t('manage_sizes')}
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_new')}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading 
        title="API"
        description={t('api_calls')}
      />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  )
}

export default SizesClient
