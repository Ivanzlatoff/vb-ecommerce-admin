"use client";

import { Locale, format } from "date-fns";
import { uk, ru, enGB } from 'date-fns/locale'
import { useTranslation } from "react-i18next";


interface CreatedProps {
  name: string,
  createdAt: Date,
  updatedAt: Date,
}

const CreatedOrUpdated = ({
  name,
  createdAt,
  updatedAt
}: CreatedProps) => {
  const { t, i18n } = useTranslation(['common']);

  const wasUpdated = format(updatedAt, "HH:mm MMMM do, yyyy") > format(createdAt, "HH:mm MMMM do, yyyy");
  const locale: Locale = i18n.language === 'uk' ? uk : i18n.language === 'ru' ? ru : enGB;

  return (
    <div className="flex items-center justify-between bg-muted py-2 px-4 rounded-lg">
      <h1 className="flex flex-row">{wasUpdated ? t('updated_by') : t('created_by')}: <p className="font-bold ml-4">{name}</p></h1>
      <i>{wasUpdated ? format(updatedAt, "HH:mm MMMM do, yyyy", { locale }) : format(createdAt, "HH:mm MMMM do, yyyy", { locale })}</i>
    </div>
  )
}

export default CreatedOrUpdated;
