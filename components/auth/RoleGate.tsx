"use client";

import React from 'react'
import FormError from "../FormError";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { useTranslation } from 'react-i18next';


interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

const RoleGate = ({
  children,
  allowedRole
}: RoleGateProps) => {
  const { t } = useTranslation('common')
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message={t('role_content')} />
    )
  }

  return (
    <>
      {children}
    </>
  )
}

export default RoleGate;
