document.addEventListener('DOMContentLoaded', function () {

    const header = document.querySelector('header');
    const navUl = document.querySelector('nav ul');

    /* ============= 1. Mobile Menu Toggle ============= */
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

    /* ============= 2. Header User Status ============= */
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && localStorage.getItem('isLoggedIn') === 'true') {
        authButtons.innerHTML = '';

        const userNameDiv = document.createElement('div');
        userNameDiv.className = 'user-name';
        userNameDiv.textContent = `Welcome, ${localStorage.getItem('userName') || 'User'}`;

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.cssText = `
            margin-left:10px;
            background:#ff6600;
            color:#fff;
            border:none;
            padding:8px 16px;
            border-radius:4px;
            cursor:pointer;
        `;

        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.reload();
        });

        authButtons.append(userNameDiv, logoutBtn);
    }

    /* ============= 3. Hero Image Zoom Effect ============= */
    const heroImageContainer = document.querySelector('.hero-image-container');
    const heroImage = document.querySelector('.hero-team-image');

    if (heroImageContainer && heroImage) {
        let ticking = false;
        const maxScale = 1;
        const minScale = 0.88;
        const scrollThreshold = 600;

        function updateHeroScale() {
            const ratio = Math.min(window.scrollY / scrollThreshold, 1);
            const scale = maxScale - (maxScale - minScale) * ratio;
            heroImageContainer.style.transform = `scale(${scale})`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeroScale);
                ticking = true;
            }
        });
    }

    /* ============= 4. Reveal Products on Scroll ============= */
    const productCards = document.querySelectorAll('.product-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        cardObserver.observe(card);
    });

    /* ============= 5. Hover Effect ============= */
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    /* ============= 6. View Button → Product Details (NO HTML CHANGE) ============= */
    document.addEventListener('click', function (e) {

        // التحقق من زر View بدون الاعتماد على class أو id
        if (
            e.target.tagName === 'BUTTON' &&
            e.target.textContent.trim() === 'View'
        ) {
            const card = e.target.closest('.product-card');
            if (!card) return;

            // محاولة استخراج ID بأي طريقة ممكنة
            let productId =
                card.dataset.id ||
                card.getAttribute('data-id') ||
                card.id ||
                '';

            // fallback في حالة عدم وجود ID
            if (!productId) {
                productId = [...document.querySelectorAll('.product-card')].indexOf(card);
            }

            // الانتقال لصفحة التفاصيل
            window.location.href = `product  details.html?id=${productId}`;
        }
    });

    /* ============= 7. Back To Top Button ============= */
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position:fixed;
        bottom:40px;
        right:40px;
        width:60px;
        height:60px;
        border-radius:50%;
        background:#003366;
        color:#fff;
        border:none;
        font-size:24px;
        cursor:pointer;
        opacity:0;
        visibility:hidden;
        transition:.4s;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.opacity = window.scrollY > 600 ? '1' : '0';
        backToTop.style.visibility = window.scrollY > 600 ? 'visible' : 'hidden';
    });

    backToTop.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
    );

});
