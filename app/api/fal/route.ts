import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fal } from "@fal-ai/client";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verifica créditos
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("creditos")
      .eq("id", user.id)
      .single();

    if (!profile || profile.creditos < 1) {
      return NextResponse.json(
        { error: "Créditos insuficientes" },
        { status: 402 }
      );
    }

    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt inválido" }, { status: 400 });
    }

    // Gera imagem via fal.ai
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: { prompt, image_size: "square_hd", num_images: 1 },
    });

    const imageUrl = (result as any).images?.[0]?.url;
    if (!imageUrl) throw new Error("Imagem não gerada");

    // Debita crédito e salva geração
    await Promise.all([
      admin
        .from("profiles")
        .update({ creditos: profile.creditos - 1 })
        .eq("id", user.id),
      admin.from("geracoes").insert({
        user_id: user.id,
        prompt,
        image_url: imageUrl,
        modelo: "flux-schnell",
      }),
    ]);

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error("[fal/route]", err);
    return NextResponse.json(
      { error: err.message ?? "Erro interno" },
      { status: 500 }
    );
  }
}
