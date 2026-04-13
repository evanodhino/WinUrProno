export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const today = '2026-04-18';
  const API_KEY = '1198041d6af647866b261840e19aead8';
  
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}&league=61&season=2026`,
      {
        headers: { 'x-apisports-key': API_KEY }
      }
    );
    const data = await response.json();
    res.status(200).json({ debug: true, data: data });
  } catch(e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
}
