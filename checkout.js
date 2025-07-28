// Form validation and Stripe integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    const completeOrderBtn = document.getElementById('complete-order');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.querySelector('.error-message');
    const errorClose = errorContainer.querySelector('.error-close');
    
    // Initialize Stripe with your publishable key
    const stripe = Stripe('pk_live_51POK99E0kqXEH6TmAwB25sol4cgZsuAgsmnr8I0n90sQZq77lZzj1bsTjhUej2hk4XiaLKuBB9ytRUnQkPnK3bKV00lksHKLjC');
    const elements = stripe.elements();

    // Create and mount the card element
    const cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    });

    // Remove old card input fields
    const oldCardInputs = document.querySelectorAll('#card-number, #expiry, #cvc');
    oldCardInputs.forEach(input => {
        if (input && input.parentElement) {
            input.parentElement.style.display = 'none';
        }
    });

    // Create new card element container
    const cardContainer = document.createElement('div');
    cardContainer.id = 'card-element';
    cardContainer.style.padding = '12px';
    cardContainer.style.border = '1px solid #ced4da';
    cardContainer.style.borderRadius = '4px';
    cardContainer.style.marginBottom = '20px';

    // Insert it after the payment section title
    const paymentSection = document.querySelector('.form-section:nth-child(2)');
    const sectionTitle = paymentSection.querySelector('.section-title');
    sectionTitle.parentNode.insertBefore(cardContainer, sectionTitle.nextSibling);

    cardElement.mount('#card-element');

    // Rate limiting setup
    const rateLimits = {
        attempts: 0,
        lastAttempt: 0,
        maxAttempts: 5,
        timeWindow: 60000, // 1 minute
        cooldown: 300000   // 5 minutes
    };

    // Error message handling
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.add('show');
        setTimeout(() => {
            errorContainer.classList.remove('show');
        }, 5000);
    }

    errorClose.addEventListener('click', () => {
        errorContainer.classList.remove('show');
    });

    // Rate limiting check
    function checkRateLimit() {
        const now = Date.now();
        
        if (now - rateLimits.lastAttempt > rateLimits.timeWindow) {
            rateLimits.attempts = 0;
        }

        if (rateLimits.attempts >= rateLimits.maxAttempts) {
            const remainingCooldown = Math.ceil((rateLimits.lastAttempt + rateLimits.cooldown - now) / 1000);
            if (remainingCooldown > 0) {
                showError(`Too many attempts. Please try again in ${Math.ceil(remainingCooldown / 60)} minutes.`);
                return false;
            }
            rateLimits.attempts = 0;
        }

        rateLimits.attempts++;
        rateLimits.lastAttempt = now;
        return true;
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!checkRateLimit()) {
            return;
        }

        // Change button state
        completeOrderBtn.disabled = true;
        completeOrderBtn.innerHTML = '<span class="spinner"></span> Processing...';

        try {
            // Create payment method
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    email: document.getElementById('email').value,
                    address: {
                        country: document.getElementById('billing-country').value,
                        postal_code: document.getElementById('billing-zip').value
                    }
                }
            });

            if (error) {
                throw error;
            }

            // Create payment intent
            const response = await fetch('/.netlify/functions/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    priceId: 'price_1RopW2E0kqXEH6TmBfvAeNmX',
                    email: document.getElementById('email').value
                })
            });

            if (!response.ok) {
                throw new Error('Payment failed. Please try again.');
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error.message);
            }

            // Handle successful payment
            console.log('Payment successful!', result);
            window.location.href = 'thank-you.html';

        } catch (error) {
            console.error('Payment error:', error);
            
            let errorMessage = 'There was an error processing your payment.';
            
            if (error.type === 'card_error' || error.type === 'validation_error') {
                errorMessage = error.message;
            }
            
            showError(errorMessage);
            
            // Reset button state
            completeOrderBtn.disabled = false;
            completeOrderBtn.innerHTML = 'Complete Order';
        }
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