"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function GerarPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleGerar(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl(null);

    try {
      const res = await fetch("/api/fal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao gerar imagem");

      setImageUrl(data.imageUrl);
      toast.success("Imagem gerada com sucesso!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerar Imagem</h1>
        <p className="text-muted-foreground mt-1">
          Descreva a imagem que deseja criar com IA
        </p>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Prompt
            <Badge variant="secondary" className="text-xs">1 crédito</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGerar} className="space-y-4">
            <Textarea
              placeholder="Ex: Um pôr do sol sobre montanhas nevadas, estilo fotorrealista, 4K..."
              className="min-h-28 resize-none bg-background/50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !prompt.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Imagem
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {imageUrl && (
        <Card className="border-border/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={imageUrl}
                alt={prompt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 flex justify-end">
              <a
                href={imageUrl}
                download="criafy.png"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4" />
                Baixar
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
