export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-arkham-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const arkhamKey = req.headers['x-arkham-key'];
  if (!arkhamKey) {
    return res.status(401).json({ error: 'Missing Arkham API key' });
  }

  const { path, ...queryParams } = req.query;
  const arkhamPath = Array.isArray(path) ? path.join('/') : path || 'transfers';

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://api.arkm.com/${arkhamPath}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'API-Key': arkhamKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
