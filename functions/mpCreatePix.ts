import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { nick, item_name, amount, coupon_code } = await req.json();

    if (!nick || !item_name || !amount) {
      return Response.json({ error: 'Campos obrigatórios: nick, item_name, amount' }, { status: 400 });
    }

    const accessToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!accessToken) {
      return Response.json({ error: 'MP_ACCESS_TOKEN não configurado' }, { status: 500 });
    }

    console.log(`[MP PIX] Criando pagamento: nick=${nick}, item=${item_name}, valor=${amount}`);

    // Cria pagamento PIX no Mercado Pago
    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `rn-${nick}-${item_name}-${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: parseFloat(amount),
        description: `Rede Nova — ${item_name} para ${nick}`,
        payment_method_id: 'pix',
        payer: {
          email: 'pagador@redenova.online',
          first_name: nick,
          last_name: 'Player',
        },
        notification_url: `https://app.base44.com/api/apps/6a050568876b935d32dff419/functions/mpWebhook`,
        metadata: { nick, item_name, coupon_code: coupon_code || '' },
      }),
    });

    const mpData = await mpRes.json();
    console.log(`[MP PIX] Resposta MP: status=${mpData.status}, id=${mpData.id}`);

    if (!mpRes.ok || !mpData.id) {
      console.error('[MP PIX] Erro Mercado Pago:', JSON.stringify(mpData));
      return Response.json({ error: mpData.message || 'Erro ao criar pagamento' }, { status: 500 });
    }

    const qr_code = mpData.point_of_interaction?.transaction_data?.qr_code;
    const qr_code_base64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64;

    // Salva Purchase com status pendente
    const purchase = await base44.asServiceRole.entities.Purchase.create({
      nick,
      item_name,
      amount: parseFloat(amount),
      confirmed: false,
      mp_payment_id: String(mpData.id),
      mp_status: 'pending',
    });

    console.log(`[MP PIX] Purchase criada: id=${purchase.id}, mp_payment_id=${mpData.id}`);

    return Response.json({
      purchase_id: purchase.id,
      mp_payment_id: mpData.id,
      qr_code,
      qr_code_base64,
      status: mpData.status,
    });
  } catch (error) {
    console.error('[MP PIX] Erro inesperado:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});