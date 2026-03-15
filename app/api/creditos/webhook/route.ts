import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

const CREDITOS_POR_PLANO: Record<string, number> = {
  starter: 50,
  pro: 200,
  ultra: 500,
};

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.CAKTO_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex")
  );
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("x-cakto-signature") ?? "";

    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }

    const event = JSON.parse(payload);

    // Apenas processa pagamentos aprovados
    if (event.status !== "approved" && event.event !== "purchase.approved") {
      return NextResponse.json({ ok: true });
    }

    const email: string = event.customer?.email ?? event.email;
    const planoId: string = event.product?.id ?? event.plan ?? "starter";
    const creditos = CREDITOS_POR_PLANO[planoId] ?? 50;

    if (!email) {
      return NextResponse.json({ error: "Email não encontrado" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Busca usuário pelo email
    const { data: authUser } = await admin
      .from("profiles")
      .select("id, creditos")
      .eq("email", email)
      .single();

    if (!authUser) {
      console.warn("[webhook] Usuário não encontrado:", email);
      return NextResponse.json({ ok: true });
    }

    // Adiciona créditos
    await admin
      .from("profiles")
      .update({ creditos: (authUser.creditos ?? 0) + creditos })
      .eq("id", authUser.id);

    // Registra transação
    await admin.from("transacoes").insert({
      user_id: authUser.id,
      tipo: "compra",
      creditos,
      plano: planoId,
      referencia: event.id ?? event.order_id,
    });

    console.log(`[webhook] +${creditos} créditos para ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[webhook/creditos]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
