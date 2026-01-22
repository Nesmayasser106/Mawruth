
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

    // ============= 3. Sign In Form with API Validation =============
    const form = document.querySelector('.form-container form');
    const usernameInput = form.querySelector('input[type="text"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const submitBtn = form.querySelector('.submit-btn');

    const createErrorMsg = (input) => {
        let error = input.parentNode.querySelector('.error-msg');
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-msg';
            error.style.color = 'red';
            error.style.fontSize = '14px';
            error.style.marginTop = '5px';
            input.parentNode.appendChild(error);
        }
        return error;
    };

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        let isValid = true;

        const usernameError = createErrorMsg(usernameInput);
        if (usernameInput.value.trim() === '') {
            usernameError.textContent = 'Please enter your username or email';
            isValid = false;
        } else {
            usernameError.textContent = '';
        }

        const passwordError = createErrorMsg(passwordInput);
        if (passwordInput.value.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }

        if (isValid) {
            try {
                const response = await fetch('http://localhost:5000/api/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: usernameInput.value.trim(),
                        password: passwordInput.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', data.user.fullName);
                    localStorage.setItem('userEmail', data.user.email);

                    submitBtn.textContent = 'Welcome! Login successful.';
                    submitBtn.style.backgroundColor = '#28a745';

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    alert(data.message); // "Invalid credentials" لو الإيميل مش موجود أو خطأ
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        }
    });

    // ============= 4. Back to Top Button =============
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

});