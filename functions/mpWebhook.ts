import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    console.log(`[MP Webhook] Body recebido: ${body}`);

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return Response.json({ error: 'Body inválido' }, { status: 400 });
    }

    const { type, data } = payload;
    console.log(`[MP Webhook] Tipo: ${type}, ID: ${data?.id}`);

    // Só processa notificações de pagamento
    if (type !== 'payment' || !data?.id) {
      return Response.json({ ok: true, skipped: true });
    }

    const paymentId = String(data.id);
    const accessToken = Deno.env.get('MP_ACCESS_TOKEN');

    // Busca detalhes do pagamento no Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const mpPayment = await mpRes.json();

    console.log(`[MP Webhook] Pagamento ${paymentId}: status=${mpPayment.status}`);

    // Mapeamento de status
    const statusMap = {
      approved: { confirmed: true, mp_status: 'approved' },
      pending: { confirmed: false, mp_status: 'pending' },
      in_process: { confirmed: false, mp_status: 'pending' },
      rejected: { confirmed: false, mp_status: 'rejected' },
      cancelled: { confirmed: false, mp_status: 'cancelled' },
    };

    const statusUpdate = statusMap[mpPayment.status] || { confirmed: false, mp_status: mpPayment.status };

    // Encontra a Purchase pelo mp_payment_id
    const purchases = await base44.asServiceRole.entities.Purchase.filter({ mp_payment_id: paymentId });

    if (!purchases || purchases.length === 0) {
      console.warn(`[MP Webhook] Nenhuma purchase encontrada para mp_payment_id=${paymentId}`);
      return Response.json({ ok: true, warning: 'purchase_not_found' });
    }

    const purchase = purchases[0];
    await base44.asServiceRole.entities.Purchase.update(purchase.id, statusUpdate);

    console.log(`[MP Webhook] Purchase ${purchase.id} atualizada: status=${statusUpdate.mp_status}, confirmed=${statusUpdate.confirmed}`);

    // Dispara webhook Discord se aprovado
    if (mpPayment.status === 'approved') {
      try {
        await base44.asServiceRole.functions.invoke('discordPurchaseWebhook', {
          nick: purchase.nick,
          item_name: purchase.item_name,
          amount: purchase.amount,
          mp_payment_id: paymentId,
        });
        console.log(`[MP Webhook] Discord notificado para compra ${purchase.id}`);
      } catch (discordErr) {
        console.warn('[MP Webhook] Falha ao notificar Discord:', discordErr.message);
      }
    }

    return Response.json({ ok: true, status: statusUpdate.mp_status });
  } catch (error) {
    console.error('[MP Webhook] Erro inesperado:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});