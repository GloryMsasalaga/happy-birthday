const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { name, message, emoji, time } = JSON.parse(event.body);
    
    if (!name || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name and message are required' }) };
    }

    const newWish = { name, message, emoji, time: time || new Date().toLocaleString() };

    const wishesStore = getStore('wishes');
    
    // Get existing wishes
    const existingWishesRaw = await wishesStore.get('wall');
    let wishes = [];
    if (existingWishesRaw) {
      try {
        wishes = JSON.parse(existingWishesRaw);
      } catch (e) {
        console.error("Error parsing existing wishes", e);
      }
    }

    // Append new wish to the list
    wishes.push(newWish);
    
    // Save back to Blob store
    await wishesStore.set('wall', JSON.stringify(wishes));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: "Wish added successfully", wish: newWish })
    };
  } catch (error) {
    console.error("Error submitting wish:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to submit wish", details: error.message, stack: error.stack })
    };
  }
};
