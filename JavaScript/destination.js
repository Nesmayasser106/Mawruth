
document.addEventListener('DOMContentLoaded', function () {

    const header = document.querySelector('header');
    const navUl = document.querySelector('nav ul');

    // ============= 1. Mobile Menu Toggle =============
    if (header && navUl) {
        const hamburger = document.createElement('div');
        hamburger.className = 'menu-toggle';
        hamburger.innerHTML = `<span></span><span></span><span></span>`;
        header.insertBefore(hamburger, navUl.parentNode);

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navUl.classList.toggle('active');
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navUl.classList.remove('active');
            });
        });
    }

    // ============= 2. Header User Status (إخفاء Sign In/Up وإظهار الاسم + Logout) =============
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && localStorage.getItem('isLoggedIn') === 'true') {
        authButtons.innerHTML = ''; // إخفاء الأزرار

        const userNameDiv = document.createElement('div');
        userNameDiv.className = 'user-name';
        userNameDiv.textContent = `Welcome, ${localStorage.getItem('userName') || 'User'}`;

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.marginLeft = '10px';
        logoutBtn.style.background = '#ff6600';
        logoutBtn.style.color = 'white';
        logoutBtn.style.border = 'none';
        logoutBtn.style.padding = '8px 16px';
        logoutBtn.style.borderRadius = '4px';
        logoutBtn.style.cursor = 'pointer';

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            window.location.reload();
        });

        authButtons.appendChild(userNameDiv);
        authButtons.appendChild(logoutBtn);
    }

    // ============= 3. Hero Map Zoom Effect =============
    const mapContainer = document.querySelector('.map-container');
    const worldMap = document.querySelector('.world-map');

    if (mapContainer && worldMap) {
        let ticking = false;
        const maxScale = 1.0;
        const minScale = 0.88;
        const scrollThreshold = 600;

        function updateMapScale() {
            const scrollY = window.scrollY;
            let ratio = Math.min(scrollY / scrollThreshold, 1);
            const scale = maxScale - (maxScale - minScale) * ratio;

            mapContainer.style.transform = `scale(${scale})`;
            mapContainer.style.transition = 'transform 0.15s ease-out';

            worldMap.style.transform = 'scale(1)';

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateMapScale);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll);
        onScroll();

        window.addEventListener('scroll', () => {
            if (window.scrollY === 0) {
                mapContainer.style.transform = 'scale(1)';
            }
        });
    }

    // ============= 4. Staggered Reveal for Cards =============
    const cards = document.querySelectorAll('.article-card, .experience-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        cardObserver.observe(card);
    });

    // ============= 5. Hover Effect on Cards =============
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
        });
    });

    // ============= 6. Start Exploring Button =============
    const startBtn = document.querySelector('.start-exploring-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            document.querySelector('.experience-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ============= 7. Back to Top Button =============
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 60px;
        height: 60px;
        background: #003366;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
        z-index: 999;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});