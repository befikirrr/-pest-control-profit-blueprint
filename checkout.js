// Form validation and Stripe integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    const completeOrderBtn = document.getElementById('complete-order');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.querySelector('.error-message');
    const errorClose = errorContainer.querySelector('.error-close');
    
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
        
        // Reset attempts if time window has passed
        if (now - rateLimits.lastAttempt > rateLimits.timeWindow) {
            rateLimits.attempts = 0;
        }

        // Check if in cooldown
        if (rateLimits.attempts >= rateLimits.maxAttempts) {
            const remainingCooldown = Math.ceil((rateLimits.lastAttempt + rateLimits.cooldown - now) / 1000);
            if (remainingCooldown > 0) {
                showError(`Too many attempts. Please try again in ${Math.ceil(remainingCooldown / 60)} minutes.`);
                return false;
            }
            // Reset after cooldown
            rateLimits.attempts = 0;
        }

        rateLimits.attempts++;
        rateLimits.lastAttempt = now;
        return true;
    }

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

    // Enhanced form validation with specific error messages
    function validateForm() {
        const email = document.getElementById('email').value;
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value;
        const cvc = document.getElementById('cvc').value;
        
        // Email validation with detailed error
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address (example@domain.com)');
            return false;
        }

        // Card number validation with specific error
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            showError('Please enter a valid credit card number (13-19 digits)');
            return false;
        }

        // Expiry validation with format check
        if (expiry.length !== 7) { // MM / YY format
            showError('Please enter a valid expiry date (MM / YY)');
            return false;
        }

        const [month, year] = expiry.split('/').map(part => part.trim());
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
            showError('Please enter a valid month (01-12)');
            return false;
        }

        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showError('This card has expired. Please use a valid card');
            return false;
        }

        // CVC validation with card-specific length
        if (cvc.length < 3 || cvc.length > 4) {
            showError('Please enter a valid security code (3-4 digits)');
            return false;
        }

        return true;
    }

    // Handle form submission with rate limiting
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check rate limiting first
        if (!checkRateLimit()) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        // Change button state
        completeOrderBtn.disabled = true;
        completeOrderBtn.innerHTML = '<span class="spinner"></span> Processing...';

        try {
            // Collect form data
            const formData = new FormData(form);
            const orderData = {
                email: formData.get('email'),
                country: formData.get('country'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                cardNumber: formData.get('card-number').replace(/\s/g, ''),
                expiry: formData.get('expiry'),
                cvc: formData.get('cvc'),
                billingCountry: formData.get('billing-country'),
                billingZip: formData.get('billing-zip')
            };

            await processPayment(orderData);
            
        } catch (error) {
            console.error('Payment error:', error);
            
            // Show user-friendly error message based on error type
            let errorMessage = 'There was an error processing your payment.';
            
            if (error.message.includes('card_declined')) {
                errorMessage = 'Your card was declined. Please try a different card.';
            } else if (error.message.includes('insufficient_funds')) {
                errorMessage = 'Insufficient funds. Please try a different card.';
            } else if (error.message.includes('expired_card')) {
                errorMessage = 'This card has expired. Please use a different card.';
            } else if (error.message.includes('invalid_number')) {
                errorMessage = 'Invalid card number. Please check and try again.';
            }
            
            showError(errorMessage);
            
            // Reset button state
            completeOrderBtn.disabled = false;
            completeOrderBtn.innerHTML = 'Complete Order';
        }
    });

    // Initialize Stripe with your publishable key
    // Use test key for development, switch to live key in production
    const stripe = Stripe('pk_test_51POK99E0kqXEH6TmjsMob8lEFNqxfdzBi1h82QhLIDhys4TDjx69WhADaeAPyRy3Rix3qOrVTpYrOcQvcIl57nXH00pjjgMZZp');

    // Real Stripe payment processing
    async function processPayment(orderData) {
        try {
            // Redirect to Stripe Checkout
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{
                    price: 'price_1RpeujE0kqXEH6Tm1gVa2y1d',
                    quantity: 1,
                }],
                mode: 'payment',
                successUrl: window.location.origin + '/thank-you.html',
                cancelUrl: window.location.origin + '/checkout.html',
                customerEmail: orderData.email,
                billingAddressCollection: 'required',
            });

            if (error) {
                throw error;
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