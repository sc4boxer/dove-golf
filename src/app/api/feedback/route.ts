import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { validateProductFeedback } from "@/lib/feedback/schema";

const MAX_BODY_BYTES = 6_000;

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return noStoreJson({ ok: false, error: "Feedback is too large." }, 413);
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return noStoreJson({ ok: false, error: "Invalid feedback origin." }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noStoreJson({ ok: false, error: "Invalid feedback." }, 400);
  }

  const parsed = validateProductFeedback(body);
  if (!parsed.ok) return noStoreJson({ ok: false, error: parsed.error }, 400);

  // Quietly accept bot-filled honeypots without writing anything.
  if (parsed.value.website) return noStoreJson({ ok: true });

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    return noStoreJson({ ok: false, error: "Feedback is temporarily unavailable." }, 503);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("product_feedback").insert({
    module: parsed.value.module,
    plan_id: parsed.value.planId,
    helpful: parsed.value.helpful,
    experience: parsed.value.experience ?? null,
    next_help: parsed.value.nextHelp ?? null,
    comment: parsed.value.comment ?? null,
  });

  if (error) {
    console.error("product_feedback_insert_failed", { code: error.code });
    return noStoreJson({ ok: false, error: "Feedback is temporarily unavailable." }, 503);
  }

  return noStoreJson({ ok: true }, 201);
}
