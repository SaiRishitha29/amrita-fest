/**
 * PARIणाम 2026 — Amrita Amaravati Fest Payment Webhook Handler
 * Supabase Edge Function / Express Webhook Controller
 * 
 * Non-Negotiable Business Rules:
 * Rule 8: Payment must be server-verified via cryptographic HMAC SHA-256. Never trust frontend claims.
 * Rule 9: Payment webhooks must be strictly idempotent (Webhook 1 -> Process, Webhook 2/3 -> Ignore).
 * Rule 12: Critical actions must be logged to audit_logs.
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { createHmac } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") ?? "test_webhook_secret_amrita_2026";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface WebhookPayload {
  entity: string;
  account_id: string;
  event: string; // e.g. "payment.captured", "order.paid"
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string; // e.g. "pay_O7m90v12345"
        order_id: string; // e.g. "order_O7m88899"
        amount: number; // in paise (e.g. 75000 = ₹750)
        currency: string;
        status: string; // "captured"
        email: string;
        contact: string;
        notes: {
          reference_id?: string;
          registration_type?: "STUDENT" | "VISITOR" | "STALL_ORDER";
          user_id?: string;
        };
      };
    };
  };
  created_at: number;
}

/**
 * Verify Razorpay HMAC SHA256 Signature
 */
function verifySignature(bodyText: string, receivedSignature: string, secret: string): boolean {
  if (!receivedSignature || !secret) return false;
  const hmac = createHmac("sha256", secret);
  hmac.update(bodyText);
  const digest = hmac.toString("hex");
  return digest === receivedSignature;
}

serve(async (req: Request) => {
  // 1. Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  // 2. Cryptographic Signature Verification
  const isValid = verifySignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET);
  if (!isValid) {
    console.error("[SECURITY ALERT] Invalid webhook signature detected. Potential forgery attempt.");
    return new Response(JSON.stringify({ error: "Invalid signature" }), { 
      status: 401, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  let eventData: WebhookPayload;
  try {
    eventData = JSON.parse(rawBody);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Malformed JSON payload" }), { status: 400 });
  }

  // Handle only captured payments
  if (eventData.event !== "payment.captured") {
    return new Response(JSON.stringify({ status: "IGNORED_EVENT_TYPE" }), { status: 200 });
  }

  const payment = eventData.payload.payment.entity;
  const paymentId = payment.id;
  const orderId = payment.order_id;
  const idempotencyKey = `WH_${paymentId}_${eventData.event}`;

  try {
    // 3. Idempotency Check in Database
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, status")
      .eq("idempotency_key", idempotencyKey)
      .single();

    if (existingPayment) {
      console.log(`[IDEMPOTENCY] Webhook duplicate detected for key: ${idempotencyKey}. Ignoring.`);
      return new Response(JSON.stringify({ 
        status: "ALREADY_PROCESSED", 
        message: "Webhook already processed" 
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. Begin Atomic Ledger Recording
    const amountInRupees = payment.amount / 100;
    const { error: paymentInsertError } = await supabase
      .from("payments")
      .insert({
        order_reference: orderId,
        gateway: "RAZORPAY",
        gateway_order_id: orderId,
        gateway_payment_id: paymentId,
        idempotency_key: idempotencyKey,
        amount: amountInRupees,
        currency: payment.currency,
        status: "SUCCESS",
        webhook_payload: eventData,
        verified_at: new Date().toISOString()
      });

    if (paymentInsertError) {
      // In case of race condition collision on unique index
      if (paymentInsertError.code === "23505") {
        return new Response(JSON.stringify({ status: "CONCURRENT_DUPLICATE_IGNORED" }), { status: 200 });
      }
      throw paymentInsertError;
    }

    // 5. Activate Entitlement Based on Notes Payload
    const regType = payment.notes?.registration_type;
    const refId = payment.notes?.reference_id;

    if (regType === "VISITOR" && refId) {
      // Activate External Visitor Pass
      await supabase
        .from("visitors")
        .update({
          payment_status: "COMPLETED",
          payment_reference: paymentId,
          total_amount_paid: amountInRupees
        })
        .eq("id", refId);

      // Audit Log
      await supabase.from("audit_logs").insert({
        actor_id: "PAYMENT_GATEWAY_WEBHOOK",
        actor_role: "SYSTEM",
        action: "VISITOR_PAYMENT_CONFIRMED",
        entity_type: "VISITOR",
        entity_id: refId,
        changes: { amount: amountInRupees, paymentId }
      });

    } else if (regType === "STALL_ORDER" && refId) {
      // Confirm Stall Express Order
      await supabase
        .from("orders")
        .update({
          payment_status: "COMPLETED",
          order_status: "PREPARING"
        })
        .eq("id", refId);

      await supabase.from("audit_logs").insert({
        actor_id: "PAYMENT_GATEWAY_WEBHOOK",
        actor_role: "SYSTEM",
        action: "ORDER_PAYMENT_CONFIRMED",
        entity_type: "ORDER",
        entity_id: refId,
        changes: { amount: amountInRupees, paymentId }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      status: "PAYMENT_CONFIRMED",
      payment_id: paymentId 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("[WEBHOOK ERROR]", error);
    return new Response(JSON.stringify({ 
      error: "Internal Processing Error", 
      message: error?.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
