import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const { order } = await req.json();
    const userId = order.user_id;

    if (!order) {
      return new Response(JSON.stringify({ error: "No order data" }), {
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=name`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );

    const profiles = await profileRes.json();
    const profileName = profiles?.[0]?.name ?? "—";

    const itemsHtml = order.items
      .map(
        (i: { title: string; quantity: string }) =>
          `<li>${i.title} × ${i.quantity} un.</li>`,
      )
      .join("");

    const html = `
      <h2>🛒 Nuevo pedido recibido</h2>
      <p><strong>ID:</strong> ${order.id}</p>
      <p><strong>Name:</strong> ${profileName}</p>
      ${order.comment ? `<p><strong>Comentario:</strong> ${order.comment}</p>` : ""}
      <p><strong>Total:</strong> € ${order.total}</p>
      <h3>Articulos</h3>
      <ul>${itemsHtml}</ul>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Andres Plant Select <pedidos@andresplantselect.com>",
        to: ["irina.nic.yu@gmail.com"],
        subject: `#${order.id}: Nuevo pedido de ${profileName}`,
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
    });
  }
});
