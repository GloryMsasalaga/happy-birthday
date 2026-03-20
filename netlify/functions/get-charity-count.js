import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  try {
    const charityStore = getStore('charity');
    let total = await charityStore.get('total');
    total = total ? parseFloat(total) : 0;
    
    return new Response(JSON.stringify({ total }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error("Error fetching charity count:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch charity count", details: error.message }), { status: 500 });
  }
};
