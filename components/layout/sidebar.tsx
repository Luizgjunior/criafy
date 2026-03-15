"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Clock,
  CreditCard,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/gerar", label: "Gerar Imagem", icon: Sparkles },
  { href: "/historico", label: "Histórico", icon: Clock },
  { href: "/creditos", label: "Créditos", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border/40 bg-background/95 backdrop-blur">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">Criafy</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground text-center">
          Criafy © 2025
        </p>
      </div>
    </aside>
  );
}
