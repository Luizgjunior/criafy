import { createAdminClient } from "@/lib/supabase/admin";

type Transacao = {
  id: string;
  user_id: string;
  tipo: string;
  valor: number | null;
  creditos: number;
  created_at: string;
  profiles: { email?: string } | null;
};

export default async function AdminCustosPage() {
  const supabase = createAdminClient();
  const { data: raw } = await supabase
    .from("transacoes")
    .select("id, user_id, tipo, valor, creditos, created_at, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(200);

  const transacoes = raw as Transacao[] | null;

  const totalReceita =
    transacoes
      ?.filter((t) => t.tipo === "compra")
      .reduce((acc, t) => acc + (t.valor ?? 0), 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Custos & Receita</h1>

      <div className="mb-6 rounded-lg border border-border p-4 bg-card inline-block">
        <p className="text-sm text-muted-foreground">Receita total</p>
        <p className="text-3xl font-bold">
          R$ {(totalReceita / 100).toFixed(2).replace(".", ",")}
        </p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuário</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Valor</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Créditos</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data</th>
            </tr>
          </thead>
          <tbody>
            {transacoes?.map((t) => (
              <tr key={t.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">
                  {t.profiles?.email ?? t.user_id}
                </td>
                <td className="px-4 py-3 capitalize">{t.tipo}</td>
                <td className="px-4 py-3">
                  {t.valor != null ? `R$ ${(t.valor / 100).toFixed(2).replace(".", ",")}` : "—"}
                </td>
                <td className="px-4 py-3">{t.creditos}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(t.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {(!transacoes || transacoes.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
