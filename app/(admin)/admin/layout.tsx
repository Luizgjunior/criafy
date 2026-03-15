import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ImageIcon,
  Ticket,
  DollarSign,
  FileText,
  Zap,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/geracoes", label: "Gerações", icon: ImageIcon },
  { href: "/admin/cupons", label: "Cupons", icon: Ticket },
  { href: "/admin/custos", label: "Custos", icon: DollarSign },
  { href: "/admin/logs", label: "Logs", icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || user.email !== adminEmail) redirect("/gerar");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar admin */}
      <aside className="flex h-screen w-56 flex-col border-r border-border/40 bg-background/95">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold">Admin — Criafy</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-border/40">
          <Link href="/gerar" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar ao app
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
