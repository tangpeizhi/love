// ====== 页面元素 ======
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const lovePage = document.getElementById('lovePage');
const heartsBg = document.getElementById('heartsBg');

// ====== 页面切换 ======
document.getElementById('toRegister').onclick = e => {
    e.preventDefault();
    loginPage.classList.remove('active');
    registerPage.classList.add('active');
};
document.getElementById('toLogin').onclick = e => {
    e.preventDefault();
    registerPage.classList.remove('active');
    loginPage.classList.add('active');
};

// ====== 飘落爱心 ======
function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = ['❤️', '💕', '💗', '💖', '💝', '🌸'][Math.floor(Math.random() * 6)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (14 + Math.random() * 18) + 'px';
    h.style.animationDuration = (6 + Math.random() * 8) + 's';
    heartsBg.appendChild(h);
    h.addEventListener('animationiteration', () => h.remove());
}
setInterval(spawnHeart, 800);
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 200);

// ====== localStorage 用户管理 ======
function getUsers() {
    return JSON.parse(localStorage.getItem('love_users') || '{}');
}
function saveUsers(u) {
    localStorage.setItem('love_users', JSON.stringify(u));
}

// ====== 注册 ======
document.getElementById('registerForm').onsubmit = e => {
    e.preventDefault();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;
    const err = document.getElementById('regError');

    if (!user) { err.textContent = '请输入用户名'; return; }
    if (pass.length < 8) { err.textContent = '密码至少需要8位'; return; }
    if (pass !== pass2) { err.textContent = '两次密码不一致'; return; }

    const users = getUsers();
    if (users[user]) { err.textContent = '用户名已存在'; return; }

    users[user] = pass;
    saveUsers(users);
    err.textContent = '';
    alert('注册成功！请登录');
    registerPage.classList.remove('active');
    loginPage.classList.add('active');
    document.getElementById('loginUser').value = user;
    document.getElementById('loginPass').value = '';
    document.getElementById('loginPass').focus();
};

// 密码长度提示
document.getElementById('regPass').oninput = function () {
    const hint = document.getElementById('passHint');
    const len = this.value.length;
    hint.textContent = len + ' / 8';
    hint.className = 'pass-hint' + (len >= 8 ? ' valid' : '');
};

// ====== 登录 ======
document.getElementById('loginForm').onsubmit = e => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const err = document.getElementById('loginError');

    if (!user) { err.textContent = '请输入用户名'; return; }
    if (!pass) { err.textContent = '请输入密码'; return; }

    const users = getUsers();
    if (!users[user]) { err.textContent = '用户不存在'; return; }
    if (users[user] !== pass) { err.textContent = '密码错误'; return; }

    err.textContent = '';
    sessionStorage.setItem('love_loggedin', user);
    enterLovePage();
};

// ====== 进入表白页 ======
function enterLovePage() {
    loginPage.classList.remove('active');
    registerPage.classList.remove('active');
    lovePage.classList.add('active');
    // 启动滚动动画
    initScrollAnimations();
}

// ====== 退出登录 ======
document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.removeItem('love_loggedin');
    lovePage.classList.remove('active');
    loginPage.classList.add('active');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginError').textContent = '';
};

// ====== 滚动进入动画 ======
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.timeline-item, .confession-card, .promise-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ====== 自动登录检测 ======
if (sessionStorage.getItem('love_loggedin')) {
    enterLovePage();
}
