import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Shield, ShieldAlert } from "lucide-react";


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
};

const Header = ({
  label
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn(
        "text-3xl font-semibold flex items-center justify-between",
        font.className,
      )}>
        <Shield className="mr-3 text-gray-500" size={32} fill="grey"/> Admin Dashboard
      </h1>
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  )
}

export default Header;
