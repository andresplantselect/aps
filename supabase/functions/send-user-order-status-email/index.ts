import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const { order } = await req.json();

    if (!order) {
      return new Response("No order", { status: 400 });
    }

    const statusText =
      order.status === "approved"
        ? "✅ Tu pedido ha sido aprobado"
        : "❌ Tu pedido ha sido rechazado";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${order.user_id}`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );

    const userData = await userRes.json();

    if (!userRes.ok) {
      console.error("Failed to fetch user:", userData);
      return new Response("Failed to fetch user", { status: 500 });
    }

    const email = userData.email;
    const orderDate = new Date(order.created_at).toLocaleDateString();

    if (!email) {
      console.error("User email not found", userData);
      return new Response("User email not found", { status: 400 });
    }

    const html = `
      <h2>${statusText}</h2>
      <p><strong>Pedido #${order.id}</strong></p>
      <p>Total: € ${order.total}</p>
      <p>Fecha: ${orderDate}</p>
      ${order.admin_comment ? `<p><strong>Comentario del vendedor:</strong><br/>${order.admin_comment}</p>` : ""}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Andres Plant Select <pedidos@andresplantselect.com>",
        to: [email],
        subject: `Estado del pedido #${order.id} de ${orderDate}`,
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Resend error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
    });
  }
});
