"use client";

import { FaUser } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger

} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { Laptop, Lock, LogOut, Server, Settings } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { useTranslation } from "react-i18next";


export const UserAccountNav = () => {
  const { t } = useTranslation(['common', 'main-nav']);
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-slate-400">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5" align="end">
        <DropdownMenuItem>
          <Link href="/user-settings" className="flex">
            <Settings className="mr-2" /> {t('main-nav:settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/user-settings/client" className="flex">
            <Laptop className="mr-2" /> {t('client_session')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/user-settings/server" className="flex">
            <Server className="mr-2" /> {t('server_session')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/user-settings/admin" className="flex">
            <Lock className="mr-2" /> {t('admin_session')}
          </Link>
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOut className="mr-2" /> {t('log_out')}
          </DropdownMenuItem>
          </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};


