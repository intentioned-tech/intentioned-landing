// Intentioned Landing Page - Main JavaScript
// Extracted to external file for CSP compliance

(function() {
    'use strict';

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            }
        });
    }

    // Hero word rotator (Slot Machine Style)
    const wrapper = document.getElementById('heroWordWrapper');
    const heroWords = [
        'Conversation',
        'Day out',
        'Presentation',
        'Interview',
        'Meeting',
        'Conference',
        'Negotiation',
        'Debrief',
        'Debate',
    ];

    let currentIndex = 0;

    // Initialize words
    if (wrapper) {
        // Add words + clone of first word for seamless loop
        [...heroWords, heroWords[0]].forEach(word => {
            const span = document.createElement('span');
            span.className = 'hero-word';
            span.textContent = word;
            wrapper.appendChild(span);
        });
    }

    function scheduleHeroWordRotate() {
        if (!wrapper) return;
        const delay = 3500 + Math.random() * 4500;
        
        setTimeout(() => {
            currentIndex++;
            
            // Animate
            wrapper.style.transition = 'transform 600ms linear';
            wrapper.style.transform = 'translateY(-' + (currentIndex * 1.1) + 'em)';

            // Handle loop
            if (currentIndex === heroWords.length) {
                // Wait for transition to finish, then snap back
                setTimeout(() => {
                    wrapper.style.transition = 'none';
                    currentIndex = 0;
                    wrapper.style.transform = 'translateY(0)';
                    // Force reflow
                    void wrapper.offsetHeight;
                }, 600);
            }

            scheduleHeroWordRotate();
        }, delay);
    }

    if (wrapper) {
        scheduleHeroWordRotate();
    }

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bento-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(card);
    });

    // Mailing list form handler
    const mailingListForm = document.getElementById('mailingListForm');
    if (mailingListForm) {
        mailingListForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('emailInput').value;
            const messageEl = document.getElementById('mailingListMessage');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            try {
                const response = await fetch('https://intentioned-license-server.jansherremway.workers.dev/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        language: navigator.language ? navigator.language.split('-')[0] : 'en',
                        consent_launch_notification: true
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    messageEl.style.color = 'var(--success)';
                    messageEl.textContent = '✅ ' + (data.message || "Thanks for subscribing! We'll notify you when we launch.");
                    document.getElementById('emailInput').value = '';
                    submitBtn.textContent = 'Subscribed!';
                } else {
                    throw new Error(data.reason || 'Subscription failed');
                }
            } catch (err) {
                messageEl.style.color = '#ef4444';
                messageEl.textContent = '❌ Something went wrong. Please try again.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subscribe';
            }
        });
    }

    // Async load Google Fonts after page render (non-blocking)
    function loadFonts() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadFonts);
    } else {
        setTimeout(loadFonts, 100);
    }
})();
