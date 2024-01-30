"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/ApiList";

import { ColorColumn, columns } from "./ColorColumns";
import { useTranslation } from "react-i18next";


interface ColorsClientProps {
  data: ColorColumn[]
}

const ColorsClient: React.FC<ColorsClientProps> = ({
  data
}) => {
  const { t } = useTranslation(['dashboard']);
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`${t('colors')} (${data.length})`}
          description={t('manage_colors')}
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
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
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  )
}

export default ColorsClient
