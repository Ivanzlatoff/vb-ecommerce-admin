"use client";

import { Check, Copy, CopyCheck, Server } from "lucide-react";
import toast from "react-hot-toast"; 

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";


interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin"
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive"
};

const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public"
}) => {
  const { t } = useTranslation(['api-alert'])
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success(t('API_copied'));
    setCopied(true) 
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>
          {textMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 bg-muted flex items-center justify-between rounded-lg">
        <code className="relative rounded px-[0.5rem] py-[0.5rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy} className="h-8 w-8 m-2">
          {!copied ? <Copy className="h-4 w-4"/> : <Check className="h-4 w-4"/>}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default ApiAlert;
