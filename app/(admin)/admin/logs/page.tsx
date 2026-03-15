import { createAdminClient } from "@/lib/supabase/admin";

type Transacao = {
  id: string;
  user_id: string;
  tipo: string;
  creditos: number;
  created_at: string;
  profiles: { email?: string } | null;
};

export default async function AdminLogsPage() {
  const supabase = createAdminClient();
  const { data: raw } = await supabase
    .from("transacoes")
    .select("id, user_id, tipo, creditos, created_at, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(500);

  const transacoes = raw as Transacao[] | null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Logs</h1>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data/Hora</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuário</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Evento</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Créditos</th>
            </tr>
          </thead>
          <tbody>
            {transacoes?.map((t) => (
              <tr key={t.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(t.created_at).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.profiles?.email ?? t.user_id}
                </td>
                <td className="px-4 py-3 capitalize">{t.tipo}</td>
                <td className="px-4 py-3">
                  <span className={t.creditos > 0 ? "text-green-400" : "text-red-400"}>
                    {t.creditos > 0 ? `+${t.creditos}` : t.creditos}
                  </span>
                </td>
              </tr>
            ))}
            {(!transacoes || transacoes.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum log encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
