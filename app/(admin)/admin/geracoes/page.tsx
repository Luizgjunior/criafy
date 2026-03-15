import { createAdminClient } from "@/lib/supabase/admin";
import Image from "next/image";

type Geracao = {
  id: string;
  user_id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string;
  profiles: { email?: string } | null;
};

export default async function AdminGeracoesPage() {
  const supabase = createAdminClient();
  const { data: geracoes } = await supabase
    .from("geracoes")
    .select("id, user_id, prompt, image_url, created_at, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerações</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(geracoes as Geracao[] | null)?.map((g) => (
          <div key={g.id} className="rounded-lg border border-border overflow-hidden bg-card">
            {g.image_url && (
              <div className="relative aspect-square">
                <Image src={g.image_url} alt={g.prompt ?? ""} fill className="object-cover" />
              </div>
            )}
            <div className="p-3 space-y-1">
              <p className="text-xs text-muted-foreground truncate">
                {g.profiles?.email ?? g.user_id}
              </p>
              <p className="text-xs line-clamp-2">{g.prompt}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(g.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        ))}
        {(!geracoes || geracoes.length === 0) && (
          <p className="col-span-full text-center text-muted-foreground py-8">
            Nenhuma geração encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
