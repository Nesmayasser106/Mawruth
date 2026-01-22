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

    // ============= 3. Hero Image Zoom Effect =============
    const heroImageContainer = document.querySelector('.hero-image-container');
    const heroImage = document.querySelector('.hero-team-image');

    if (heroImageContainer && heroImage) {
        let ticking = false;
        const maxScale = 1.0;
        const minScale = 0.88;
        const scrollThreshold = 600;

        function updateHeroScale() {
            const scrollY = window.scrollY;
            let ratio = Math.min(scrollY / scrollThreshold, 1);
            const scale = maxScale - (maxScale - minScale) * ratio;

            heroImageContainer.style.transform = `scale(${scale})`;
            heroImageContainer.style.transition = 'transform 0.15s ease-out';

            heroImage.style.transform = 'scale(1)';

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateHeroScale);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll);
        onScroll();

        window.addEventListener('scroll', () => {
            if (window.scrollY === 0) {
                heroImageContainer.style.transform = 'scale(1)';
            }
        });
    }

    // ============= 4. Reveal Animation on Scroll =============
    const revealElements = document.querySelectorAll(`
        .mission-section,
        .vision-section,
        .team-section,
        .how-section,
        .team-member,
        .section-content
    `);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        revealObserver.observe(el);
    });

    // ============= 5. Team Member Hover Effect =============
    document.querySelectorAll('.team-member').forEach(member => {
        const img = member.querySelector('img');

        member.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.12)';
            img.style.transition = 'transform 0.5s ease';
            member.style.transform = 'translateY(-10px)';
        });

        member.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            member.style.transform = 'translateY(0)';
        });
    });

    // ============= 6. Back to Top Button =============
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
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
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








let btn = document.getElementById("startBtn");
btn.onclick = function () {
document.getElementById("title").innerText = "Let’s Start Learning";
};


let pass = document.getElementById("password");
let btn = document.getElementById("toggle");
btn.onclick = function () {
if (pass.type === "password") {
pass.type = "text";
} else {
pass.type = "password";
}
};


let count = 0;
document.getElementById("likeBtn").onclick = function () {
count++;
document.getElementById("likes").innerText = count;
};

document.getElementById("submit").onclick = function () {
let name = document.getElementById("username").value;
document.getElementById("result").innerText = name;
};