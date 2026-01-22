
document.addEventListener('DOMContentLoaded', function () {

    // ============= 1. Mobile Menu ) =============
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle hamburger';  
    menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    document.querySelector('header').insertBefore(menuToggle, document.querySelector('nav'));

    const navUl = document.querySelector('nav ul');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navUl.classList.toggle('active');
    });

    // إغلاق القائمة عند الضغط على رابط
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navUl.classList.remove('active');
        });
    });
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
            window.location.reload(); // إعادة تحميل الصفحة
        });

        authButtons.appendChild(userNameDiv);
        authButtons.appendChild(logoutBtn);
    }

    // ============= 2. Header Background on Scroll =============
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(0, 51, 102, 0.95)'; // أغمق قليلاً
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#003366';
            header.style.backdropFilter = 'none';
        }
    });

    // ============= 3. Reveal on Scroll Animation =============
    const revealElements = document.querySelectorAll('.section h2, .card, .stat-card, .testimonial-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        // transition الموجود في CSS
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });

    // ============= 4. Newsletter Form Handling =============
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const subscribeBtn = newsletterForm.querySelector('.btn');

        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = emailInput.value.trim();

            if (!email || !email.includes('@') || !email.includes('.')) {
                alert('⚠️ يرجى إدخال بريد إلكتروني صحيح.');
                return;
            }

            // رسالة نجاح مؤقتة
            const originalText = subscribeBtn.textContent;
            subscribeBtn.textContent = '✓ تم الاشتراك!';
            subscribeBtn.style.background = '#28a745';
            subscribeBtn.disabled = true;

            setTimeout(() => {
                emailInput.value = '';
                subscribeBtn.textContent = originalText;
                subscribeBtn.style.background = '';
                subscribeBtn.disabled = false;
            }, 3000);
        });
    }

    // ============= 5. Back to Top Button  =============
    // ============= 3. Back to Top Button =============
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
        if (window.scrollY > 500) {
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

    // ============= 6. Card Hover Enhancement  =============
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

});

