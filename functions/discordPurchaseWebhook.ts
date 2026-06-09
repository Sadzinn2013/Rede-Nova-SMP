import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const WEBHOOK_URL = "https://discord.com/api/webhooks/1511180776534708316/s309rgFqyNFtF8Zkwf3GGj51dvW9TALYVpsEDjprytr1B2rt0INRYLGSU50ArTed03WZ";

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    // Quando chamado pela entity automation, os dados chegam em body.data
    const payload = body.data || body;
    const { nick, item_name, mp_status } = payload;

    // Proteção extra: só envia se o status for aprovado
    if (mp_status && mp_status !== 'approved') {
      console.log(`[Discord Webhook] Ignorado — status=${mp_status}`);
      return Response.json({ skipped: true, reason: 'not_approved' });
    }

    const { nick: _nick, item_name: _item } = { nick, item_name };

    const message = {
      content: null,
      embeds: [
        {
          title: "💎 NOVA COMPRA REALIZADA",
          color: 0xC5A059,
          fields: [
            { name: "👤 Jogador", value: _nick || "Desconhecido", inline: true },
            { name: "🎖️ Produto", value: _item || "Desconhecido", inline: true },
            { name: "⏰ Duração", value: "30 dias", inline: true },
          ],
          description: "✨ Obrigado por apoiar a **Rede-Nova SMP**!\n\nDesejamos uma ótima jornada e muitas aventuras pelo servidor.",
          footer: { text: "Rede Nova • Loja Oficial" },
          timestamp: new Date().toISOString(),
        }
      ]
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});