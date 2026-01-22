
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

    // ============= 3. Add to Cart with API =============
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', async function () {
            const product = {
                name: document.querySelector('.product-info h2').textContent.trim(),
                price: document.querySelector('.product-info .price').textContent.trim(),
                image: document.querySelector('.product-gallery > img').src,
                id: Date.now() // معرف فريد
            };

            try {
                const response = await fetch('http://localhost:5000/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product)
                });

                const data = await response.json();

                if (response.ok) {
                    this.textContent = 'Added to Cart!';
                    this.style.backgroundColor = '#28a745';

                    setTimeout(() => {
                        window.location.href = 'cart.html';
                    }, 1000);
                } else {
                    alert(data.message);
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        });
    }

    // ============= 4. Product Gallery =============
    const mainImage = document.querySelector('.product-gallery > img');
    const thumbnails = document.querySelectorAll('.thumbs img');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            mainImage.alt = thumb.alt;
            mainImage.style.opacity = '0.6';
            setTimeout(() => mainImage.style.opacity = '1', 100);
        });
    });

    // ============= 5. Tabs Functionality =============
    const tabButtons = document.querySelectorAll('.tab-buttons button');
    const tabContent = document.querySelector('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const tabText = this.textContent.trim();

            if (tabText.includes('Description')) {
                tabContent.innerHTML = '<p>Each rug is crafted using traditional weaving techniques passed down through generations. Minor variations in color and pattern are natural.</p>';
            } else if (tabText.includes('Additional Information')) {
                tabContent.innerHTML = '<ul><li><strong>Material:</strong> 100% Wool</li><li><strong>Size:</strong> 160cm x 230cm</li></ul>';
            } else if (tabText.includes('Reviews')) {
                tabContent.innerHTML = '<p>No reviews yet.</p>';
            }
        });
    });

    // ============= 6. Related Products Hover =============
    document.querySelectorAll('.related .card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

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