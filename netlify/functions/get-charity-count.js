const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    const charityStore = getStore('charity');
    let total = await charityStore.get('total');
    total = total ? parseFloat(total) : 0;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ total })
    };
  } catch (error) {
    console.error("Error fetching charity count:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch charity count", details: error.message, stack: error.stack })
    };
  }
};
