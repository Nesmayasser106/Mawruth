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
        userNameDiv.textContent = `Welcome, ${localStorage.getItem('userName') || 'Explorer'}`;

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.marginLeft = '15px';
        logoutBtn.style.background = '#ff6600';
        logoutBtn.style.color = 'white';
        logoutBtn.style.border = 'none';
        logoutBtn.style.padding = '10px 20px';
        logoutBtn.style.borderRadius = '6px';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.fontWeight = 'bold';

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            window.location.reload();
        });

        authButtons.appendChild(userNameDiv);
        authButtons.appendChild(logoutBtn);
    }

    // ============= 3. Hero Gallery Parallax + Zoom Effect =============
    // ============= 3. Hero Gallery Zoom Effect - الإطار يتقلص مع الصورة =============
const heroGalleryContainer = document.querySelector('.hero-gallery');
const heroGalleryImg = document.querySelector('.hero-gallery img');

if (heroGalleryContainer && heroGalleryImg) {
    let ticking = false;
    const maxScale = 1.0;        // الحجم الكامل في الأعلى
    const minScale = 0.88;      
    const scrollThreshold = 600; // المسافة اللي يوصل عندها التصغير الكامل

    function updateGalleryScale() {
        const scrollY = window.scrollY;
        let ratio = Math.min(scrollY / scrollThreshold, 1);
        const scale = maxScale - (maxScale - minScale) * ratio;

        // نطبق الـ scale على الحاوية (اللي فيها الـ border والـ border-radius)
        heroGalleryContainer.style.transform = `scale(${scale})`;
        heroGalleryContainer.style.transition = 'transform 0.18s ease-out';

        // الصورة نفسها نحافظ عليها مملوءة داخل الحاوية
        heroGalleryImg.style.transform = 'scale(1)';
        heroGalleryImg.style.objectFit = 'cover';

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateGalleryScale);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // تشغيل أولي

    // إعادة الحجم للأصلي عند الرجوع لأعلى الصفحة تمامًا
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            heroGalleryContainer.style.transform = 'scale(1)';
        }
    });
}

    // ============= 4. Staggered Reveal Animation for Cards =============
    const cards = document.querySelectorAll('.category-card, .media-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 120); // تأخير متسلسل جميل
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) scale(0.95)';
        card.style.transition = 'opacity 1s ease, transform 1s ease';
        cardObserver.observe(card);
    });

    // ============= 5. Powerful Hover Effect on Category & Media Cards =============
    document.querySelectorAll('.category-card, .media-card').forEach(card => {
        const img = card.querySelector('img');

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-20px)';
            img.style.transform = 'scale(1.15)';
            card.style.boxShadow = '0 30px 60px rgba(0, 34, 68, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            img.style.transform = 'scale(1)';
            card.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
        });
    });

    // ============= 6. Interactive Map Hover Effect =============
    const mapCard = document.querySelector('.map-card');
    const mapOverlay = document.querySelector('.map-overlay');

    if (mapCard && mapOverlay) {
        mapCard.addEventListener('mouseenter', () => {
            mapOverlay.style.background = 'rgba(11,30,58,0.9)';
            mapOverlay.style.transform = 'translate(-50%, -50%) scale(1.05)';
        });

        mapCard.addEventListener('mouseleave', () => {
            mapOverlay.style.background = 'rgba(11,30,58,0.8)';
            mapOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        mapOverlay.style.transition = 'all 0.5s ease';
    }

    // ============= 7. Back to Top Button =============
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
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
        font-size: 26px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.5s ease;
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 700) {
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