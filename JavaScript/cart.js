document.addEventListener('DOMContentLoaded', function () {

    /* ================= Header & Mobile Menu ================= */
    const header = document.querySelector('header');
    const navUl = document.querySelector('nav ul');

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

    /* ================= User Auth UI ================= */
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

    /* ================= Cart ================= */
    const cartTableBody = document.querySelector('table tbody');
    const subtotalTd = document.querySelector('.totals table tr:nth-child(1) td:nth-child(2)');
    const totalTd = document.querySelector('.totals table tr:nth-child(3) td:nth-child(2)');
    const checkoutBtn = document.querySelector('.totals button');

    /* ===== Load Cart ===== */
    async function loadCart() {
        try {
            const res = await fetch('http://localhost:5000/api/cart');
            const cart = await res.json();

            cartTableBody.innerHTML = '';

            cart.forEach(item => {
                const price = parseFloat(item.price.replace('$', ''));

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="remove" data-id="${item.id}">×</span></td>
                    <td><img src="${item.image}" class="product-img"></td>
                    <td>${item.name}</td>
                    <td data-price="${price}">$${price.toFixed(2)}</td>
                    <td>
                        <input type="number"
                               class="quantity"
                               value="${item.quantity}"
                               min="1"
                               data-id="${item.id}">
                    </td>
                    <td class="row-subtotal">$${(price * item.quantity).toFixed(2)}</td>
                `;
                cartTableBody.appendChild(row);
            });

            updateTotals();
        } catch {
            alert('Error loading cart');
        }
    }

    /* ===== Remove Item (❌) ===== */
    cartTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove')) {
            const id = e.target.dataset.id;
            try {
                await fetch(`http://localhost:5000/api/cart/${id}`, { method: 'DELETE' });
                loadCart();
            } catch {
                alert('Error removing item');
            }
        }
    });

    /* ===== Update Quantity ===== */
    cartTableBody.addEventListener('change', async (e) => {
        if (e.target.classList.contains('quantity')) {
            if (e.target.value < 1) e.target.value = 1;

            const input = e.target;
            const row = input.closest('tr');
            const price = parseFloat(row.querySelector('[data-price]').dataset.price);
            const quantity = parseInt(input.value);
            const id = input.dataset.id;

            row.querySelector('.row-subtotal').textContent =
                '$' + (price * quantity).toFixed(2);

            updateTotals();

            try {
                await fetch(`http://localhost:5000/api/cart/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity })
                });
            } catch {
                alert('Error updating quantity');
            }
        }
    });

    /* ===== Totals ===== */
    function updateTotals() {
        let total = 0;
        document.querySelectorAll('.row-subtotal').forEach(td => {
            total += parseFloat(td.textContent.replace('$', ''));
        });

        subtotalTd.textContent = '$' + total.toFixed(2);
        totalTd.textContent = '$' + total.toFixed(2);

        checkoutBtn.style.backgroundColor =
            cartTableBody.rows.length ? '#28a745' : '';
    }

    /* ===== Checkout ===== */
    checkoutBtn.addEventListener('click', () => {
        if (!cartTableBody.rows.length) return alert('Cart is empty');

        checkoutBtn.textContent = 'Checkout successful!';
        checkoutBtn.style.backgroundColor = '#28a745';
        checkoutBtn.disabled = true;

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });

    loadCart();

    /* ================= Back To Top ================= */
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
        transition:.3s;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.opacity = window.scrollY > 500 ? '1' : '0';
        backToTop.style.visibility = window.scrollY > 500 ? 'visible' : 'hidden';
    });

    backToTop.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
    );
});
