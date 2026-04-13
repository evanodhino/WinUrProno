export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await fetch(
      'https://v3.football.api-sports.io/status',
      {
        headers: {
          'x-apisports-key': '1198041d6af647866b261840e19aead8'
        }
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
