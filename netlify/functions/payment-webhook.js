import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const paymentData = await req.json();
    console.log("🎉 New Payment Received via Snippe!");
    console.log("Payment Details:", paymentData);
    
    const amount = parseFloat(paymentData.amount) || parseFloat(paymentData.total) || parseFloat(paymentData.value) || 1;

    const charityStore = getStore('charity');
    let currentTotal = await charityStore.get('total');
    currentTotal = currentTotal ? parseFloat(currentTotal) : 0;
    const newTotal = currentTotal + amount;
    
    await charityStore.set('total', newTotal.toString());
    
    return new Response(JSON.stringify({ message: "Webhook received successfully!", total: newTotal }), { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: "Invalid payload or processing error", details: error.message }), { status: 400 });
  }
};
