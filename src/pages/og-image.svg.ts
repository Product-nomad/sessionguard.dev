export const GET = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect x="0" y="580" width="1200" height="4" fill="#22c55e"/>
  <text x="80" y="260" font-family="'JetBrains Mono', monospace" font-size="72" font-weight="600" fill="#e8e8e8">SessionGuard</text>
  <text x="80" y="340" font-family="'JetBrains Mono', monospace" font-size="28" fill="#888888">See what your AI coding agent actually did.</text>
  <text x="80" y="410" font-family="'JetBrains Mono', monospace" font-size="22" fill="#22c55e">npm install -g @sessionguard/cli</text>
  <text x="80" y="540" font-family="'JetBrains Mono', monospace" font-size="18" fill="#555555">sessionguard.dev</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
