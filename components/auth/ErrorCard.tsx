import CardWrapper from "@/components/auth/CardWrapper";
import { AlertTriangleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";



const ErrorCard = () => {
  const { t } = useTranslation();

  return (
    <CardWrapper
      headerLabel={t('common:wrong')}
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <AlertTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
