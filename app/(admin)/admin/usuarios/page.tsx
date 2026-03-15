import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminUsuariosPage() {
  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, nome, creditos, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usuários</h1>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Créditos</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((p: { id: string; email: string; nome: string | null; creditos: number; created_at: string }) => (
              <tr key={p.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">{p.nome ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                <td className="px-4 py-3">{p.creditos}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {(!profiles || profiles.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
