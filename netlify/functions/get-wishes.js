const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const wishesStore = getStore('wishes');
    const existingWishesRaw = await wishesStore.get('wall');
    
    let wishes = [];
    if (existingWishesRaw) {
      try {
        wishes = JSON.parse(existingWishesRaw);
      } catch (e) {
        console.error("Error parsing existing wishes", e);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ wishes })
    };
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch wishes", details: error.message, stack: error.stack, wishes: [] })
    };
  }
};
