const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Only allow POST requests for the webhook
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the incoming payment data from Snippe
    const paymentData = JSON.parse(event.body);
    
    // Log the payment data to the Netlify Functions console
    console.log("🎉 New Payment Received via Snippe!");
    console.log("Payment Details:", paymentData);
    
    // Determine the donation amount (default to 1 if not specified or format is unexpected)
    const amount = parseFloat(paymentData.amount) || parseFloat(paymentData.total) || parseFloat(paymentData.value) || 1;

    // Use Netlify Blobs to store the charity run total
    const charityStore = getStore('charity');
    let currentTotal = await charityStore.get('total');
    currentTotal = currentTotal ? parseFloat(currentTotal) : 0;
    
    const newTotal = currentTotal + amount;
    
    // Save the new total back to the Blob store
    await charityStore.set('total', newTotal.toString());
    
    console.log(`Donation of ${amount} added. New total: ${newTotal}`);

    // Respond to Snippe to acknowledge successful receipt of the webhook
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Webhook received successfully!", total: newTotal }),
    };

  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid payload or processing error", details: error.message, stack: error.stack })
    };
  }
};
