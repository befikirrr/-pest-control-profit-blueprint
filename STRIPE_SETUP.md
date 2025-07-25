# 🚀 Complete Your Stripe Setup

## Step 1: Create Product in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/products
2. Click: "+ Add Product"
3. Fill out:
   - **Name:** Pest Control Profit Blueprint
   - **Description:** Complete guide to dominating local pest control market
   - **Price:** $19.00 USD
   - **Recurring:** No (one-time payment)
4. Click: "Save Product"
5. Copy the **Price ID** (looks like `price_1A2B3C4D5E6F`)

## Step 2: Update Your Code

Open `checkout.js` and find this line:
```javascript
price: 'price_1234567890', // Replace with your actual Price ID from Stripe Dashboard
```

Replace `price_1234567890` with your actual Price ID from step 1.

## Step 3: Test!

1. Go to your checkout page
2. Fill out the form with test card: `4242 4242 4242 4242`
3. Any future expiry date and any 3-digit CVC
4. Click "Complete Order"
5. You'll be redirected to Stripe's secure checkout
6. Complete the payment
7. Success = redirected to your thank you page!

## 🎉 You're Live!

Your checkout now processes real payments with Stripe's enterprise-grade security!

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- More test cards: https://stripe.com/docs/testing#cards 