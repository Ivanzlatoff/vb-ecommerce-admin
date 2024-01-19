import { AlertTriangle } from "lucide-react";


interface FormErrorProps {
  message?: string;
};

const FormError = ({
  message
}: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 dark:bg-destructive/50 p-3 rounded-md flex items-center gap-x-2 text-destructive dark:text-red-200">
      <AlertTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}

export default FormError;
