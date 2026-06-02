document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC ELEMENT INJECTION
    injectGlobalLayouts();

    // 2. RUN ENGINE COMPONENT INITIALIZATIONS
    initCustomCursor();
    initPreloader();
    initTypewriter();
    initModals();
    initFAQandForms();
});
function injectGlobalLayouts() {
    // Inject Custom Cursor target if it doesn't exist
    if (!document.querySelector('.custom-cursor-img')) {
        const cursorEl = document.createElement('div');
        cursorEl.className = 'custom-cursor-img';
        cursorEl.style.cssText = 'left: -100px; top: -100px;';
        document.body.insertBefore(cursorEl, document.body.firstChild);
    }

    // Populate Navigation Bar Template
    const navContainer = document.querySelector('nav.global-navbar');
    if (navContainer) {
        navContainer.className = 'navbar';
        navContainer.innerHTML = `
            <div class="nav-container">
                <a href="index.html" class="logo"><strong>ASTRA</strong><span id="mc">MC</span></a>
                <div class="nav-links">
                    <a href="index.html" class="nav-item"><strong>Telescope</strong></a>
                    <a href="help.html" class="nav-item"><strong>Help</strong></a>
                    <a href="store.html" class="nav-item"><strong>Store</strong></a>
                </div>
            </div>`;
    }

    // Populate Floating Socials Template
    const socialContainer = document.querySelector('div.global-socials');
    if (socialContainer) {
        socialContainer.className = 'social-floating-wrapper';
        socialContainer.innerHTML = `
            <a href="https://discord.com/invite/b83HFWkER8" class="button">
                <div class="icon"><i class="fab fa-discord"></i></div>
                <span>Discord</span>
            </a>
            <a href="error.html" class="button">
                <div class="icon"><i class="fab fa-x-twitter"></i></div>
                <span>Twitter</span>
            </a>
            <a href="error.html" class="button">
                <div class="icon"><i class="fab fa-github"></i></div>
                <span>Github</span>
            </a>
            <a href="error.html" class="button">
                <div class="icon"><i class="fab fa-youtube"></i></div>
                <span>YouTube</span>
            </a>`;
    }

    // Populate Footer Template
    const footerContainer = document.querySelector('footer.global-footer');
    if (footerContainer) {
        footerContainer.className = 'site-footer';
        footerContainer.innerHTML = `
            <div class="footer-container">
                <div class="footer-top-grid">
                    <div class="footer-brand-column">
                        <h2 class="footer-logo">ASTRA</h2>
                        <p class="footer-tagline">Crafting a bespoke digital ecosystem built meticulously around direct community modules.</p>
                        <div class="footer-newsletter">
                            <label for="footer-email">STAY INSIDE THE ORBIT</label>
                            <div class="newsletter-field">
                                <input type="email" id="footer-email" placeholder="Enter your email address" disabled>
                                <button class="newsletter-btn" type="button"><i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="footer-links-column">
                        <h3>Navigation</h3>
                        <ul>
                            <li><a href="index.html">Telescope</a></li>
                            <li><a href="help.html">Help Center</a></li>
                            <li><a href="store.html">Store</a></li>
                            <li><a href="error.html">Status Panel</a></li>
                        </ul>
                    </div>
                    <div class="footer-links-column">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="error.html">Documentation</a></li>
                            <li><a href="error.html">GitHub Core</a></li>
                        </ul>
                    </div>
                    <div class="footer-links-column">
                        <h3>Legal Suite</h3>
                        <ul>
                            <li><a href="error.html">Terms of Use</a></li>
                            <li><a href="error.html">Privacy Protocol</a></li>
                            <li><a href="error.html">EULA Manifesto</a></li>
                            <li><a href="error.html">Cookie Matrices</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-watermark"><span>ASTRA MC</span></div>
            </div>`;
    }
}

/**
 * Handles custom fluid responsive cursor tracking and node trailing
 */
let isAppLoading = true;
function initCustomCursor() {
    const crosshair = document.querySelector('.custom-cursor-img');
    let lastX = null, lastY = null;
    const dotSpacing = 4;

    if (!crosshair) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        crosshair.style.left = `${posX}px`;
        crosshair.style.top = `${posY}px`;
        
        // Context-aware cursor changes
        if (isAppLoading) {
            crosshair.className = 'custom-cursor-img loading';
        } else {
            crosshair.style.display = 'none';
            const hoveredElement = document.elementFromPoint(posX, posY);
            crosshair.style.display = 'block';

            if (hoveredElement) {
                const interactiveEl = hoveredElement.closest('a, button, input, select, textarea, [role="button"], .nav-item, .button, .tab-btn, .faq-trigger, .faq-trigger *, .id-bar-trigger, .id-bar-trigger *, .btn-home');
                if (interactiveEl) {
                    crosshair.className = interactiveEl.hasAttribute('disabled') ? 'custom-cursor-img disabled' : 'custom-cursor-img pointer';
                } else {
                    crosshair.className = 'custom-cursor-img';
                }
            }
        }

        // Particle Trail Logic
        if (lastX === null || lastY === null) {
            lastX = posX; lastY = posY; return;
        }
        const distance = Math.hypot(posX - lastX, posY - lastY);
        if (distance >= dotSpacing) {
            const steps = Math.floor(distance / dotSpacing);
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const node = document.createElement('div');
                node.className = 'cursor-trail-node';
                node.style.left = `${lastX + (posX - lastX) * t}px`;
                node.style.top = `${lastY + (posY - lastY) * t}px`;
                document.body.appendChild(node);
                setTimeout(() => node.remove(), 600);
            }
            lastX = posX; lastY = posY;
        }
    });

    document.addEventListener('mouseleave', () => crosshair.style.display = 'none');
    document.addEventListener('mouseenter', () => crosshair.style.display = 'block');
}

/**
 * Resolves Preloader transitions safely
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const factTarget = document.getElementById('preloader-fact');
    
    const generalFacts = [
        "Pro Tip: You can customize your UI modules seamlessly directly from our settings suite.",
        "Fun Fact: This website interface was built with micro-frame optimization streams.",
        "Did you know? Telescope is the name of our backend core module handling client checks."
    ];

    if (factTarget) {
        factTarget.textContent = generalFacts[Math.floor(Math.random() * generalFacts.length)];
    }

    setTimeout(() => {
        isAppLoading = false;
        const crosshair = document.querySelector('.custom-cursor-img');
        if (crosshair) crosshair.className = 'custom-cursor-img';
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 600);
        }
    }, 1500);
}

/**
 * Dynamic content-slider Typewriter engine for index layouts
 */
function initTypewriter() {
    const textTarget = document.getElementById("typewriter-text");
    if (!textTarget) return;

    const words = ["Launcher", "Client", "Mods"];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function handleTypewriter() {
        if (isAppLoading) {
            setTimeout(handleTypewriter, 100);
            return;
        }
        const currentWord = words[wordIndex];
        textTarget.textContent = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        let typeSpeed = isDeleting ? 60 : 120;
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }
        setTimeout(handleTypewriter, typeSpeed);
    }
    setTimeout(handleTypewriter, 1000);
}

/**
 * Handle card overlay systems for team showcases
 */
function initModals() {
    const triggers = document.querySelectorAll('.id-bar-trigger');
    const overlays = document.querySelectorAll('.modal-overlay');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const userId = trigger.getAttribute('data-user');
            const targetOverlay = document.querySelector(`.modal-overlay[data-user="${userId}"]`);
            if (targetOverlay) targetOverlay.classList.add('active');
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });
}

/**
 * Local database and interface controls for Help segments
 */
function initFAQandForms() {
    // Accordion Control
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                faqItems.forEach(i => {
                    i.classList.remove('open');
                    const c = i.querySelector('.faq-content');
                    if(c) c.style.maxHeight = null;
                });
                if (!isOpen) {
                    item.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    });

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.help-tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = document.getElementById(`tab-${btn.dataset.tab}`);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Client Side Search Filter
    const searchInput = document.getElementById('help-search');
    const searchEmptyState = document.getElementById('search-empty');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const kbTab = document.querySelector('.tab-btn[data-tab="kb"]');
            if (kbTab) kbTab.click();
            
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            faqItems.forEach(item => {
                const keywords = item.dataset.keywords?.toLowerCase() || '';
                const titleText = item.querySelector('.faq-trigger span')?.textContent.toLowerCase() || '';
                if (keywords.includes(query) || titleText.includes(query)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            if (searchEmptyState) searchEmptyState.style.display = (visibleCount === 0) ? 'block' : 'none';
        });
    }

    // Storage Logging Systems
    const toast = document.getElementById('toast-note');
    function triggerToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    const bugForm = document.getElementById('bug-form');
    if (bugForm) {
        bugForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bugReport = {
                id: 'BUG-' + Date.now(),
                user: document.getElementById('bug-username').value,
                category: document.getElementById('bug-category').value,
                description: document.getElementById('bug-desc').value,
                timestamp: new Date().toLocaleDateString()
            };
            const currentBugs = JSON.parse(localStorage.getItem('astra_bug_reports') || '[]');
            currentBugs.unshift(bugReport);
            localStorage.setItem('astra_bug_reports', JSON.stringify(currentBugs));
            triggerToast(`Success! Anomaly captured under ID: ${bugReport.id}`);
            e.target.reset();
        });
    }

    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedback = {
                id: 'FEED-' + Date.now(),
                contact: document.getElementById('feed-email').value,
                type: document.getElementById('feed-type').value,
                message: document.getElementById('feed-message').value,
                timestamp: new Date().toLocaleDateString()
            };
            const currentFeedback = JSON.parse(localStorage.getItem('astra_feedback_docs') || '[]');
            currentFeedback.unshift(feedback);
            localStorage.setItem('astra_feedback_docs', JSON.stringify(currentFeedback));
            triggerToast(`Proposal successfully cached into system files.`);
            e.target.reset();
        });
    }
}