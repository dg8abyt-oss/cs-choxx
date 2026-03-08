// api/get-iframe.js

export default async function handler(req, res) {
  // 1. Get the URL from the frontend request
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // 2. Access your secure API key from environment variables
  const apiKey = process.env.API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    // 3. Make the authenticated request to the external API
    const targetApiUrl = `https://cs-chox.dhruvs.host/api/iframe?url=${encodeURIComponent(url)}`;
    
    const apiResponse = await fetch(targetApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    // 4. Extract the HTML/content returned by the API
    const iframeContent = await apiResponse.text();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).send(iframeContent);
    }

    // 5. Send the iframe content back to your frontend
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(iframeContent);

  } catch (error) {
    console.error('API Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch the iframe content' });
  }
}
