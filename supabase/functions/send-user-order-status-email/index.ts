import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

import { LOGO_BASE64 } from '../_shared/logo.ts';

serve(async (req: Request) => {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response('No orderId', { status: 400 });
    }

    // @ts-expect-error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    // @ts-expect-error
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=*`,
      {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
      },
    );
    const orders = await orderRes.json();
    const order = orders?.[0];

    if (!order) {
      return new Response('Order not found', { status: 404 });
    }

    const isApproved = order.status === 'approved';

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
      console.error('Failed to fetch user:', userData);
      return new Response('Failed to fetch user', { status: 500 });
    }

    const email = userData.email;
    const orderDate = new Date(order.created_at).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    if (!email) {
      console.error('User email not found', userData);
      return new Response('User email not found', { status: 400 });
    }

    const statusBlock = isApproved
      ? `<div style="background:#e4f0eb; border-radius:8px; padding:16px; text-align:center; margin-bottom:24px;">
          <p style="margin:0; font-size:18px; font-weight:700; color:#365c46;">Tu pedido ha sido aprobado</p>
          <p style="margin:6px 0 0; font-size:13px; color:#4a7c5f;">Tu pedido está listo para recoger</p>
         </div>`
      : `<div style="background:#F8ECEC; border-radius:8px; padding:16px; text-align:center; margin-bottom:24px;">
          <p style="margin:0; font-size:18px; font-weight:700; color:#8A1B1B;">Tu pedido ha sido cancelado</p>
          <p style="margin:6px 0 0; font-size:13px; color:#C94A4A;">Lo sentimos, no pudimos procesar tu pedido</p>
         </div>`;

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
              ${statusBlock}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px; border-collapse:collapse;">
                <tr>
                  <td style="padding:5px 0; font-size:13px; color:#6B7280; width:120px;">Pedido</td>
                  <td style="padding:5px 0; font-size:13px; color:#1F2933; font-weight:600;">#${order.id}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0; font-size:13px; color:#6B7280;">Fecha</td>
                  <td style="padding:5px 0; font-size:13px; color:#1F2933;">${orderDate}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0; font-size:13px; color:#6B7280;">Total</td>
                  <td style="padding:5px 0; font-size:13px; color:${isApproved ? '#4a7c5f' : '#1F2933'}; font-weight:700;">€ ${Number(order.total).toFixed(2)}</td>
                </tr>
              </table>

              ${
                order.admin_comment
                  ? `
              <div style="background:#F7F8F7; border-radius:8px; padding:14px 16px; font-size:13px; color:#6B7280; font-style:italic;">
                ${order.admin_comment}
              </div>`
                  : ''
              }
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

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Andres Plant Select <pedidos@andresplantselect.es>',
        to: [email],
        subject: `Estado del pedido #${order.id} de ${orderDate}`,
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Resend error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
    });
  }
});
