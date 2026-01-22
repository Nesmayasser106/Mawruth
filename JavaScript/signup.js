
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
        authButtons.innerHTML = '';

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

    // ============= 3. Sign Up Form with API - English Messages & Redirect to Sign In =============
    const form = document.querySelector('.form-container form');
    const inputs = form.querySelectorAll('input');
    const submitBtn = form.querySelector('.submit-btn');
    const termsCheckbox = document.getElementById('terms');

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

    // إزالة رسائل الخطأ عند الكتابة
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            createErrorMsg(input).textContent = '';
        });
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        let isValid = true;

        // Full Name
        const fullName = inputs[0];
        if (fullName.value.trim() === '') {
            createErrorMsg(fullName).textContent = 'Please enter your full name';
            isValid = false;
        }

        // Username
        const username = inputs[1];
        if (username.value.trim() === '') {
            createErrorMsg(username).textContent = 'Please enter a username';
            isValid = false;
        }

        // Email
        const email = inputs[2];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            createErrorMsg(email).textContent = 'Please enter your email';
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            createErrorMsg(email).textContent = 'Please enter a valid email address';
            isValid = false;
        }

        // Password
        const password = inputs[3];
        if (password.value.length < 8) {
            createErrorMsg(password).textContent = 'Password must be at least 8 characters long';
            isValid = false;
        }

        // Confirm Password
        const confirmPassword = inputs[4];
        if (confirmPassword.value !== password.value) {
            createErrorMsg(confirmPassword).textContent = 'Passwords do not match';
            isValid = false;
        }

        // Terms Checkbox
        if (!termsCheckbox.checked) {
            alert('You must agree to the terms and conditions');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await fetch('http://localhost:5000/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: fullName.value.trim(),
                        username: username.value.trim(),
                        email: email.value.trim(),
                        password: password.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // رسالة نجاح بالإنجليزية على الزر
                    submitBtn.textContent = 'Account created successfully!';
                    submitBtn.style.backgroundColor = '#28a745';
                    submitBtn.disabled = true;

                    // لا نحفظ حالة الدخول هنا، لأننا ننقله لـ Sign In
                    // (المستخدم لازم يسجل دخول يدويًا)

                    // الانتقال إلى صفحة Sign In بعد 1.5 ثانية
                    setTimeout(() => {
                        window.location.href = 'signin.html'; // ← التعديل الرئيسي
                    }, 1500);
                } else {
                    // رسائل خطأ من الـ API بالإنجليزية
                    alert(data.message || 'An error occurred. Please try again.');
                }
            } catch (err) {
                console.error('Signup error:', err);
                alert('Unable to connect to server. Please check if the backend is running.');
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