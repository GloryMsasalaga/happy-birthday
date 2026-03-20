import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { name, message, emoji, time } = await req.json();
    
    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'Name and message are required' }), { status: 400 });
    }

    const newWish = { name, message, emoji, time: time || new Date().toLocaleString() };

    const wishesStore = getStore('wishes');
    const existingWishesRaw = await wishesStore.get('wall');
    let wishes = [];
    if (existingWishesRaw) {
      try { wishes = JSON.parse(existingWishesRaw); } catch (e) { }
    }

    wishes.push(newWish);
    await wishesStore.set('wall', JSON.stringify(wishes));

    return new Response(JSON.stringify({ message: "Wish added successfully", wish: newWish }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error("Error submitting wish:", error);
    return new Response(JSON.stringify({ error: "Failed to submit wish", details: error.message }), { status: 500 });
  }
};
