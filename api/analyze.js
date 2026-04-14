export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { home, away, sport, competition, formHome, formAway } = req.body;

  const prompt = `Tu es un expert en pronostics sportifs. Analyse ce match et génère un pronostic précis.

Match: ${home} vs ${away}
Sport: ${sport}
Compétition: ${competition}
Forme ${home}: ${formHome || 'inconnue'}
Forme ${away}: ${formAway || 'inconnue'}

Réponds UNIQUEMENT en JSON avec ce format exact:
{
  "verdict": "Victoire ${home}" ou "Victoire ${away}" ou "Match nul probable",
  "analyse": "Explication de 2-3 phrases en français",
  "proba_home": nombre entre 0 et 100,
  "proba_draw": nombre entre 0 et 100,
  "proba_away": nombre entre 0 et 100,
  "confiance": nombre entre 1 et 5
}
Les probabilités doivent totaliser 100.`;

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
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const prono = JSON.parse(clean);
    res.status(200).json(prono);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
