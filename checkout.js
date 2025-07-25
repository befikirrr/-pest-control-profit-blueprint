// Form validation and Stripe integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    const completeOrderBtn = document.getElementById('complete-order');
    
    // Form field formatting
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvcInput = document.getElementById('cvc');

    // Format card number input
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    // Format expiry date input
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    // Format CVC input (numbers only)
    cvcInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    // Form validation
    function validateForm() {
        const email = document.getElementById('email').value;
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value;
        const cvc = document.getElementById('cvc').value;
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Card number validation (basic length check)
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            alert('Please enter a valid card number');
            return false;
        }

        // Expiry validation
        if (expiry.length !== 7) { // MM / YY format
            alert('Please enter a valid expiry date');
            return false;
        }

        // CVC validation
        if (cvc.length < 3 || cvc.length > 4) {
            alert('Please enter a valid security code');
            return false;
        }

        return true;
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Change button state
        completeOrderBtn.disabled = true;
        completeOrderBtn.innerHTML = 'Processing...';

        try {
            // Collect form data
            const formData = new FormData(form);
            const orderData = {
                email: formData.get('email'),
                country: formData.get('country'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                paymentMethod: formData.get('payment-method'),
                // Add card details here for Stripe processing
                cardNumber: formData.get('card-number').replace(/\s/g, ''),
                expiry: formData.get('expiry'),
                cvc: formData.get('cvc'),
                billingCountry: formData.get('billing-country'),
                billingZip: formData.get('billing-zip')
            };

            // TODO: Replace with your Stripe API integration
            await processPayment(orderData);
            
        } catch (error) {
            console.error('Payment error:', error);
            alert('There was an error processing your payment. Please try again.');
            
            // Reset button state
            completeOrderBtn.disabled = false;
            completeOrderBtn.innerHTML = 'Complete Order';
        }
    });

    // Initialize Stripe with your publishable key
    const stripe = Stripe('pk_live_51POK99E0kqXEH6TmAwB25sol4cgZsuAgsmnr8I0n90sQZq77lZzj1bsTjhUej2hk4XiaLKuBB9ytRUnQkPnK3bKV00lksHKLjC');

    // Real Stripe payment processing
    async function processPayment(orderData) {
        try {
            // Redirect to Stripe Checkout
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{
                    // You need to create this price ID in your Stripe Dashboard
                    // Go to Products > Add Product > "Pest Control Profit Blueprint" > $19.00
                    price: 'price_1RopW2E0kqXEH6TmBfvAeNmX', // Correct Price ID from Stripe Dashboard
                    quantity: 1,
                }],
                mode: 'payment',
                successUrl: window.location.origin + '/thank-you.html',
                cancelUrl: window.location.origin + '/checkout.html',
                customerEmail: orderData.email,
                // Pre-fill billing info
                billingAddressCollection: 'required',
            });

            if (error) {
                throw new Error(error.message);
            }

        } catch (error) {
            console.error('Stripe error:', error);
            throw error;
        }
    }

    // Payment method switching
    const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
    const cardFields = document.querySelector('.form-section:nth-child(2)');
    
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'card') {
                // Show card fields
                cardFields.style.display = 'block';
            } else {
                // Hide card fields for alternative payment methods
                // You would implement Apple Pay/Amazon Pay integration here
                console.log('Selected payment method:', this.value);
            }
        });
    });

    // Auto-populate billing address from contact info
    const countrySelect = document.getElementById('country');
    const zipInput = document.getElementById('zip');
    const billingCountrySelect = document.getElementById('billing-country');
    const billingZipInput = document.getElementById('billing-zip');

    countrySelect.addEventListener('change', function() {
        billingCountrySelect.value = this.value;
    });

    zipInput.addEventListener('input', function() {
        billingZipInput.value = this.value;
    });
}); 