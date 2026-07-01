export const onRequestPost: PagesFunction<{ WAITLIST: KVNamespace }> = async (ctx) => {
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

  const accept = ctx.request.headers.get('accept') ?? '';
  if (accept.includes('application/json')) {
    return Response.json({ ok: true });
  }

  return Response.redirect(new URL('/?success=1#early-access', ctx.request.url).toString(), 303);
};
