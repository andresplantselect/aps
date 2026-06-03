import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

import { LOGO_BASE64 } from '../_shared/logo.ts';

serve(async (req: Request) => {
  try {
    const { order } = await req.json();

    if (!order) {
      return new Response('No order', { status: 400 });
    }

    // @ts-expect-error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    // @ts-expect-error
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    if (!userRes.ok || !userData.email) {
      console.error('Failed to fetch user:', userData);
      return new Response('Failed to fetch user', { status: 500 });
    }

    const email = userData.email;
    const orderDate = new Date(order.created_at).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const itemsRows = order.items
      .map((i: { title: string; quantity: number; price: number }) => {
        const price = Number(i.price);
        const subtotal = (price * i.quantity).toFixed(2);
        return `
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #E5E7EB; color: #1F2933; font-size: 13px;">${i.title}</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 13px; text-align: center;">${i.quantity} uds</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 13px; text-align: right;">€ ${price.toFixed(2)}</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #E5E7EB; color: #1F2933; font-size: 13px; font-weight: 600; text-align: right;">€ ${subtotal}</td>
          </tr>`;
      })
      .join('');

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0; padding:0; background-color:#F7F8F7; font-family:Manrope,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F8F7; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <tr>
            <td style="background-color:#4a7c5f; border-radius:18px 18px 0 0; padding:20px 40px; text-align:center;">
              <img src="${LOGO_BASE64}" alt="Andres Plant Select" style="height:52px; width:auto; display:block; margin:0 auto;"/>
            </td>
          </tr>

          <tr>
            <td style="background-color:#FFFFFF; padding:28px 40px; border:1px solid #E5E7EB; border-top:none;">

              <div style="background:#e4f0eb; border-radius:8px; padding:16px; text-align:center; margin-bottom:24px;">
                <p style="margin:0; font-size:18px; font-weight:700; color:#365c46;">Hemos recibido tu pedido</p>
                <p style="margin:6px 0 0; font-size:13px; color:#4a7c5f;">Te avisaremos cuando esté confirmado</p>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px; border-collapse:collapse;">
                <tr>
                  <td style="padding:5px 0; font-size:13px; color:#6B7280; width:120px;">Pedido</td>
                  <td style="padding:5px 0; font-size:13px; color:#1F2933; font-weight:600;">#${order.id}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0; font-size:13px; color:#6B7280;">Fecha</td>
                  <td style="padding:5px 0; font-size:13px; color:#1F2933;">${orderDate}</td>
                </tr>
                ${
                  order.comment
                    ? `
                <tr>
                  <td style="padding:5px 0; font-size:13px; color:#6B7280; vertical-align:top;">Comentario</td>
                  <td style="padding:5px 0; font-size:13px; color:#1F2933;">${order.comment}</td>
                </tr>`
                    : ''
                }
              </table>

              <hr style="border:none; border-top:1px solid #E5E7EB; margin:0 0 20px;"/>

              <p style="margin:0 0 10px; font-size:14px; font-weight:600; color:#1F2933;">Productos</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB; border-radius:12px; overflow:hidden; border-collapse:collapse;">
                <thead>
                  <tr style="background-color:#F7F8F7;">
                    <th style="padding:8px 14px; font-size:11px; font-weight:600; color:#6B7280; text-align:left; text-transform:uppercase; letter-spacing:0.06em;">Producto</th>
                    <th style="padding:8px 14px; font-size:11px; font-weight:600; color:#6B7280; text-align:center; text-transform:uppercase; letter-spacing:0.06em;">Cantidad</th>
                    <th style="padding:8px 14px; font-size:11px; font-weight:600; color:#6B7280; text-align:right; text-transform:uppercase; letter-spacing:0.06em;">Precio/ud</th>
                    <th style="padding:8px 14px; font-size:11px; font-weight:600; color:#6B7280; text-align:right; text-transform:uppercase; letter-spacing:0.06em;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <p style="text-align:right; font-size:15px; font-weight:700; color:#1F2933; margin:14px 0 0;">
                Total: <span style="color:#4a7c5f;">€ ${Number(order.total).toFixed(2)}</span>
              </p>

            </td>
          </tr>

          <tr>
            <td style="background-color:#e4f0eb; border-radius:0 0 18px 18px; padding:16px 40px; text-align:center; border:1px solid #E5E7EB; border-top:none;">
              <p style="margin:0; font-size:11px; color:#6B7280;">© ${new Date().getFullYear()} Andres Plant Select · andresplantselect.es</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // @ts-expect-error
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        // @ts-expect-error
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Andres Plant Select <pedidos@andresplantselect.es>',
        to: [email],
        subject: `Confirmación de pedido #${order.id}`,
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
    });
  }
});
