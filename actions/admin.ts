"use server";

import initTranslations from "@/app/i18n";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";


export const admin = async (currentLocale: string) => {
  const { t } = await initTranslations({
    locale: currentLocale, 
    namespaces: ['admin']
  })

  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: t('allowed') };
  }

  return { error: t('fordidden') }
}