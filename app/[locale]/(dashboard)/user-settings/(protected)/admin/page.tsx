"use client";

import { admin } from "@/actions/admin";
import FormSuccess from "@/components/FormSuccess";
import RoleGate from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";


const AdminPage = () => {
  const { t, i18n } = useTranslation(['admin']);
  const currentLocale = i18n.language;
  const onServerActionClick = () => {
    admin(currentLocale)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }

        if (data.success) {
          toast.success(data.success);
        }
      })
  }

  const onApiRouteClick = () => {
    fetch("/api/admin")
      .then((response) => {
        if (response.ok) {
          toast.success(t('allowed_API'))
        } else {
          toast.error(t('fordbidden_API'))
        }
      });
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          🔑 {t('admin')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message={t('allowed_content')} />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            {t('admin_only_API')}
          </p>
          <Button onClick={onApiRouteClick}>
            {t('test')}
          </Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            {t('admin_only_server')}
          </p>
          <Button onClick={onServerActionClick}>
            {t('test')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage;
