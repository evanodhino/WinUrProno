export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { home, away, sport, competition, formHome, formAway } = req.body;

  const prompt = `Tu es un expert en pronostics sportifs. Analyse ce match et génère un pronostic précis.
Match: ${home} vs ${away}
Sport: ${sport}
Compétition: ${competition}
Forme ${home}: ${formHome || 'inconnue'}
Forme ${away}: ${formAway || 'inconnue'}

Réponds UNIQUEMENT en JSON valide avec ce format:
{"verdict":"Victoire ${home}","analyse":"Explication en 2-3 phrases en français.","proba_home":65,"proba_draw":20,"proba_away":15,"confiance":4}
Les probabilités doivent totaliser exactement 100.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    
    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: JSON.stringify(data) });
    }

    const text = data.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'JSON non trouvé dans: ' + text });
    
    const prono = JSON.parse(match[0]);
    res.status(200).json(prono);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
