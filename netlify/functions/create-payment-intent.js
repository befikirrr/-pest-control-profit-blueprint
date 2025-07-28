const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { paymentMethodId, priceId, email } = JSON.parse(event.body);

        // Retrieve the price from Stripe
        const price = await stripe.prices.retrieve(priceId);

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: price.currency,
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            receipt_email: email,
            return_url: 'https://your-site.netlify.app/thank-you.html',
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: { message: error.message } })
        };
    }
}; 