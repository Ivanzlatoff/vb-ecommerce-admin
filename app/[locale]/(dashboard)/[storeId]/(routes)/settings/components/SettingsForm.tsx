"use client";

import * as z from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { Store } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { redirect, useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/ui/ApiAlert";
import useOrigin from "@/app/[locale]/hooks/useOrigin";
import { useSession } from "next-auth/react";
import CreatedOrUpdated from "@/components/CreatedOrUpdated";
import { useTranslation } from "react-i18next";


interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData
}) => {
  const { t } = useTranslation(['settings']);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user.id;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success(t('store_updated'));
    } catch (error) {
      toast.error(t('wrong'))
    } finally {
      setLoading(false)
    }
  };

  const onDelete = async () => {
    if (userId) {
      try {
          setLoading(true);
          await axios.delete(`/api/stores/${params.storeId}`);
          router.refresh();
          router.push("/");
        toast.success(t('store_deleted'))
      } catch (error) {
        toast.error(t('del_prod_and_cat_first'))
      } finally {
        setLoading(false)
        setOpen(false)
      }
    } else {
      redirect("/auth/login");
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
      <div className="flex items-center justify-between">
        <Heading 
          title={t('store_settings')}
          description={t('manage_store_preferences')}
        />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder={t('store_name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            disabled={loading} 
            className="ml-auto" 
            type="submit"
          >
            {t('save_changes')}
          </Button>
        </form>
      </Form>
      <CreatedOrUpdated
        name={session?.user?.name!}
        createdAt={initialData.createdAt}
        updatedAt={initialData.updatedAt}
      />
      <Separator />
      <ApiAlert 
        title="NEXT_PUBLIC_API_URL" 
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}

export default SettingsForm;
