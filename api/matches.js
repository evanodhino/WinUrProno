export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const today = '2024-03-30';
  const leagueIds = [61, 39, 140, 78, 135, 2, 3];
  const API_KEY = '1198041d6af647866b261840e19aead8';
  const allMatches = [];
  
  for (const league of leagueIds) {
    try {
      const response = await fetch(
        `https://v3.football.api-sports.io/fixtures?date=${today}&league=${league}&season=2024`,
        {
          headers: { 'x-apisports-key': API_KEY }
        }
      );
      const data = await response.json();
      if (data.response && data.response.length > 0) {
        allMatches.push(...data.response);
      }
    } catch(e) {
      console.log('Error league', league);
    }
  }
  
  return new Response(JSON.stringify({ matches: allMatches }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
