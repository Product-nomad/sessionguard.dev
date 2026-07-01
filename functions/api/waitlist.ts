interface Env {
  WAITLIST: KVNamespace;
  RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await ctx.request.formData();
  const email = body.get('email')?.toString().trim();

  if (!email || !email.includes('@')) {
    return new Response('Invalid email', { status: 400 });
  }

  const key = `email:${Date.now()}:${email}`;
  await ctx.env.WAITLIST.put(key, JSON.stringify({
    email,
    timestamp: new Date().toISOString(),
    source: 'sessionguard.dev',
  }));

  // Send confirmation email via Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ctx.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SessionGuard <noreply@waiting.sessionguard.dev>',
      to: email,
      subject: "You're on the SessionGuard early access list",
      html: `<div style="background:#0a0a0a;color:#e8e8e8;font-family:'JetBrains Mono',monospace;padding:40px;max-width:560px;margin:0 auto">
  <p style="color:#22c55e;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 24px">SessionGuard</p>
  <h1 style="font-size:20px;font-weight:600;margin:0 0 16px;color:#e8e8e8">You're on the list.</h1>
  <p style="font-size:14px;color:#888;line-height:1.6;margin:0 0 24px">
    We'll reach out when SessionGuard Pro is ready. You're getting early access to:
  </p>
  <ul style="font-size:13px;color:#888;line-height:2;padding-left:0;list-style:none;margin:0 0 32px">
    <li>→ Team dashboard</li>
    <li>→ Compliance report (EU AI Act)</li>
    <li>→ Cursor + Windsurf adapters</li>
    <li>→ Dollar-cost estimation</li>
  </ul>
  <p style="font-size:13px;color:#555;margin:0">
    — Simon · <a href="https://sessionguard.dev" style="color:#22c55e;text-decoration:none">sessionguard.dev</a>
  </p>
</div>`,
    }),
  });

  const accept = ctx.request.headers.get('accept') ?? '';
  if (accept.includes('application/json')) {
    return Response.json({ ok: true });
  }

  return Response.redirect(new URL('/?success=1#early-access', ctx.request.url).toString(), 303);
};
