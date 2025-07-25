// Smooth scrolling and interactive enhancements
document.addEventListener('DOMContentLoaded', function() {
    
    // Add loading animation to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply fade-in animation to key elements
    const elementsToAnimate = document.querySelectorAll(
        '.gap-section, .quote-box, .stat-box, .transformation-box, .testimonial-box, .solution-section, .blueprint-contents, .vision-section, .urgency-section, .final-cta-section, .stats-hero, .timeline-section, .real-results-section, .bonus-stack-section, .special-offer-section, .choice-section, .faq-section, .final-urgency-section'
    );

    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Enhanced CTA button interactions - Updated to include all new buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .main-cta-button, .primary-cta-button, .final-cta-button, .mega-cta-button');
    ctaButtons.forEach(button => {
        if (button) {
            // Remove click handler - buttons are now proper links to checkout.html
            // Just keep the hover effects

            // Add hover effects
            button.addEventListener('mouseenter', function() {
                if (this.classList.contains('main-cta-button') || this.classList.contains('primary-cta-button') || this.classList.contains('final-cta-button') || this.classList.contains('mega-cta-button')) {
                    this.style.transform = 'translateY(-3px) scale(1.02)';
                } else {
                    this.style.transform = 'translateY(-3px) scale(1.02)';
                }
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    });

    // Add subtle animations to highlight elements
    const highlights = document.querySelectorAll('.highlight-red, .highlight-blue, .highlight-green, .highlight-orange, .highlight-gold, .highlight-money');
    
    highlights.forEach(highlight => {
        highlight.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 8px currentColor';
            this.style.transition = 'text-shadow 0.3s ease';
        });
        
        highlight.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });

    // Smooth scroll for any internal links (if added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #D14900, #b83f00);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Add subtle parallax effect to header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (header && scrolled < window.innerHeight) {
            header.style.transform = `translateY(${parallax}px)`;
        }
    });

    // Typewriter effect for main headline (subtle)
    const headline = document.querySelector('.main-headline');
    if (headline && !localStorage.getItem('headlineAnimated')) {
        const text = headline.innerHTML;
        headline.innerHTML = '';
        headline.style.borderRight = '2px solid white';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                headline.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            } else {
                headline.style.borderRight = 'none';
                localStorage.setItem('headlineAnimated', 'true');
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Add entrance animation to stat number
    const statNumber = document.querySelector('.stat-number');
    if (statNumber) {
        const finalNumber = parseInt(statNumber.textContent);
        const statObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let currentNumber = 0;
                    const increment = finalNumber / 30;
                    
                    const updateNumber = function() {
                        currentNumber += increment;
                        if (currentNumber < finalNumber) {
                            statNumber.textContent = Math.floor(currentNumber) + '%';
                            requestAnimationFrame(updateNumber);
                        } else {
                            statNumber.textContent = finalNumber + '%';
                        }
                    };
                    
                    updateNumber();
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumber.textContent = '0%';
        statObserver.observe(statNumber);
    }

    // Add staggered entrance animation for feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        
        const featureObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    featureObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        featureObserver.observe(item);
    });

    // Add entrance animation for vision items
    const visionItems = document.querySelectorAll('.vision-item');
    visionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        
        const visionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    visionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        visionObserver.observe(item);
    });

    // Add animated counting for stats hero numbers
    const statsNumbers = document.querySelectorAll('.stat-number-large');
    statsNumbers.forEach(statElement => {
        const originalText = statElement.textContent;
        const number = parseInt(originalText.replace(/[^0-9]/g, ''));
        
        if (number) {
            const statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let currentNumber = 0;
                        const increment = number / 30;
                        const suffix = originalText.replace(/[0-9]/g, '');
                        
                        const updateNumber = function() {
                            currentNumber += increment;
                            if (currentNumber < number) {
                                statElement.textContent = Math.floor(currentNumber) + suffix;
                                requestAnimationFrame(updateNumber);
                            } else {
                                statElement.textContent = originalText;
                            }
                        };
                        
                        statElement.textContent = '0' + suffix;
                        updateNumber();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(statElement);
        }
    });

    // Add ROI number animation
    const roiNumber = document.querySelector('.roi-number');
    if (roiNumber) {
        const finalNumber = parseInt(roiNumber.textContent);
        const roiObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let currentNumber = 0;
                    const increment = finalNumber / 40;
                    
                    const updateNumber = function() {
                        currentNumber += increment;
                        if (currentNumber < finalNumber) {
                            roiNumber.textContent = Math.floor(currentNumber) + '%';
                            requestAnimationFrame(updateNumber);
                        } else {
                            roiNumber.textContent = finalNumber + '%';
                        }
                    };
                    
                    roiNumber.textContent = '0%';
                    updateNumber();
                    roiObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        roiObserver.observe(roiNumber);
    }

    // Add staggered entrance animation for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        timelineObserver.observe(item);
    });

    // Add staggered entrance animation for result cards
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(' + (index % 2 === 0 ? '-' : '') + '30px)';
        card.style.transition = `opacity 0.8s ease ${index * 0.3}s, transform 0.8s ease ${index * 0.3}s`;
        
        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        cardObserver.observe(card);
    });

    // Add staggered entrance animation for bonus items
    const bonusItems = document.querySelectorAll('.bonus-item');
    bonusItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;
        
        const bonusObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    bonusObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        bonusObserver.observe(item);
    });

    // Add staggered entrance animation for FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        const faqObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    faqObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        faqObserver.observe(item);
    });

    // Add hover effects for path cards
    const pathCards = document.querySelectorAll('.path');
    pathCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add mobile menu toggle if needed (for future expansion)
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', function(e) {
        // Prevent bounce effect on iOS
        if (e.touches[0].clientY > touchStartY) {
            e.preventDefault();
        }
    }, { passive: false });

    console.log('Pest Control Landing Page loaded successfully! 🐛➡️💰');
}); 