import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Crown, Star } from "lucide-react";

const planos = [
  {
    id: "starter",
    nome: "Starter",
    creditos: 50,
    preco: "R$ 19,90",
    icon: Zap,
    destaque: false,
    descricao: "Ideal para experimentar",
  },
  {
    id: "pro",
    nome: "Pro",
    creditos: 200,
    preco: "R$ 59,90",
    icon: Star,
    destaque: true,
    descricao: "Mais popular",
  },
  {
    id: "ultra",
    nome: "Ultra",
    creditos: 500,
    preco: "R$ 129,90",
    icon: Crown,
    destaque: false,
    descricao: "Para uso intenso",
  },
];

export default async function CreditosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("creditos")
    .eq("id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Créditos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seus créditos para geração de imagens
        </p>
      </div>

      {/* Saldo atual */}
      <Card className="border-border/40 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Coins className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo atual</p>
            <p className="text-3xl font-bold">{profile?.creditos ?? 0}</p>
            <p className="text-xs text-muted-foreground">créditos disponíveis</p>
          </div>
        </CardContent>
      </Card>

      {/* Planos */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Comprar créditos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {planos.map(({ id, nome, creditos, preco, icon: Icon, destaque, descricao }) => (
            <Card
              key={id}
              className={`border-border/40 relative ${
                destaque ? "border-primary/60 bg-primary/5 shadow-lg shadow-primary/10" : ""
              }`}
            >
              {destaque && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs">
                  Mais popular
                </Badge>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${destaque ? "text-primary" : "text-muted-foreground"}`} />
                  <CardTitle className="text-base">{nome}</CardTitle>
                </div>
                <CardDescription className="text-xs">{descricao}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{creditos}</span>
                    <span className="text-sm text-muted-foreground">créditos</span>
                  </div>
                  <p className="text-lg font-semibold text-primary mt-1">{preco}</p>
                </div>
                <Button
                  className="w-full"
                  variant={destaque ? "default" : "outline"}
                  size="sm"
                >
                  Comprar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Histórico de transações */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Histórico de transações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma transação encontrada
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
