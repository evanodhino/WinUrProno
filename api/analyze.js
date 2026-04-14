export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 500,
        messages: [{ role: 'user', content: 'Dis juste ok en JSON: {"test": "ok"}' }]
      })
    });
    const data = await response.json();
    res.status(200).json({ 
      debug: true, 
      data: data, 
      key_exists: !!process.env.ANTHROPIC_API_KEY,
      all_keys: Object.keys(process.env).filter(k => k.includes('ANTHRO'))
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
