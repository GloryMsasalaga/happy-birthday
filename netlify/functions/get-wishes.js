import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const wishesStore = getStore('wishes');
    const existingWishesRaw = await wishesStore.get('wall');
    
    let wishes = [];
    if (existingWishesRaw) {
      try { wishes = JSON.parse(existingWishesRaw); } catch (e) { }
    }

    return new Response(JSON.stringify({ wishes }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch wishes", details: error.message, wishes: [] }), { status: 500 });
  }
};
