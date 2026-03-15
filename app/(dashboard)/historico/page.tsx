import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export default async function HistoricoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: geracoes } = await supabase
    .from("geracoes")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
        <p className="text-muted-foreground mt-1">
          Suas imagens geradas anteriormente
        </p>
      </div>

      {!geracoes?.length ? (
        <Card className="border-border/40 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Nenhuma imagem gerada ainda.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Vá em Gerar Imagem para começar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {geracoes.map((g) => (
            <Card key={g.id} className="group border-border/40 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={g.image_url}
                    alt={g.prompt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {g.prompt}
                  </p>
                  <Badge variant="secondary" className="text-[10px]">
                    {new Date(g.created_at).toLocaleDateString("pt-BR")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
