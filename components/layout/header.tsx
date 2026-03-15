"use client";

import { Coins, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  creditos?: number;
}

export function Header({ userEmail, userName, creditos = 0 }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const initials = userName
    ? userName.slice(0, 2).toUpperCase()
    : userEmail?.slice(0, 2).toUpperCase() ?? "ZA";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/40 bg-background/95 px-6 backdrop-blur">
      <div />

      <div className="flex items-center gap-4">
        {/* Saldo de créditos */}
        <Badge
          variant="secondary"
          className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium"
        >
          <Coins className="h-3.5 w-3.5 text-yellow-400" />
          <span>{creditos} créditos</span>
        </Badge>

        {/* Avatar + menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-full ring-2 ring-border hover:ring-primary transition-all focus:outline-none"
            aria-label="Menu do usuário"
          >
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName ?? "Usuário"}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
