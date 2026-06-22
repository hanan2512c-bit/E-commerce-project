// ── THEME (LIGHT / DARK MODE) ──
function getStoredTheme() {
  try { return localStorage.getItem('simplon_theme') || 'light'; } catch(e) { return 'light'; }
}
function applyTheme(theme) {
  var t = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('simplon_theme', t); } catch(e) {}
  var icon = document.getElementById('themeIcon');
  if (icon) icon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ── AUTH HELPERS ──
function getAuthUser() {
  try { return JSON.parse(localStorage.getItem('simplon_user') || 'null'); } catch(e) { return null; }
}
function setAuthUser(user) {
  localStorage.setItem('simplon_user', JSON.stringify(user));
}
function clearAuthUser() {
  localStorage.removeItem('simplon_user');
}

function renderNav(active) {
  const links = [
    { href: 'index.html',    label: 'Home' },
    { href: 'about.html',    label: 'About' },
    { href: 'products.html', label: 'Products' },
    { href: 'gallery.html',  label: 'Gallery' },
    { href: 'feedback.html', label: 'Feedback' },
    { href: 'contact.html',  label: 'Contact' },
  ];
  const items = links.map(l =>
    `<li class="nav-item">
      <a class="nav-link${l.label===active?' active':''}" href="${l.href}">${l.label}</a>
    </li>`
  ).join('');

  const user = getAuthUser();
  const profileBtn = user
    ? `<div class="profile-dropdown" id="profileDropdown">
        <button class="nav-icon-btn profile-btn" id="profileToggle" title="My Account">
          <i class="fa-solid fa-circle-user"></i>
          <span class="profile-name-badge">${user.name.split(' ')[0]}</span>
        </button>
        <div class="profile-menu" id="profileMenu">
          <div class="profile-menu-header">
            <div class="profile-avatar"><i class="fa-solid fa-user"></i></div>
            <div>
              <div class="profile-menu-name">${user.name}</div>
              <div class="profile-menu-email">${user.email}</div>
            </div>
          </div>
          <hr class="profile-divider"/>
          <a class="profile-menu-item" href="order.html"><i class="fa-solid fa-bag-shopping me-2"></i>My Orders</a>
          <button class="profile-menu-item text-danger" onclick="logoutUser()"><i class="fa-solid fa-right-from-bracket me-2"></i>Sign Out</button>
        </div>
      </div>`
    : `<button class="nav-icon-btn profile-btn" id="profileToggle" title="Sign In / Sign Up" onclick="openAuthModal()">
        <i class="fa-solid fa-circle-user"></i>
      </button>`;

  document.getElementById('navbar-placeholder').innerHTML = `
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
      <a class="navbar-brand" href="index.html">
        <i class="fa-solid fa-spa me-2"></i>SIMPLON <span>Beauty</span>
      </a>
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <i class="fa-solid fa-bars text-white"></i>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto gap-1">${items}</ul>
        <div class="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0">
          <button class="nav-icon-btn theme-toggle-btn" id="themeToggleBtn" title="Toggle Light/Dark Mode"><i class="fa-solid fa-moon" id="themeIcon"></i></button>
          <button class="nav-icon-btn" id="searchToggleBtn" title="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
          <a href="order.html" class="nav-icon-btn position-relative" title="Cart">
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="nav-cart-badge" id="navCartCount">0</span>
          </a>
          ${profileBtn}
        </div>
      </div>
    </div>
  </nav>

  <!-- POPUP SEARCH BAR -->
  <div class="search-overlay" id="searchOverlay">
    <div class="search-box-container">
      <button class="search-close-btn" id="searchCloseBtn">&times;</button>
      <h5 class="search-title"><i class="fa-solid fa-magnifying-glass me-2"></i>Search Our Products</h5>
      <form id="navbarSearchForm" onsubmit="handleNavbarSearch(event)">
        <div class="search-input-group">
          <input type="text" id="navbarSearchInput" placeholder="Search by name, description, keyword..." required/>
          <select id="navbarSearchCat">
            <option value="all">All Categories</option>
            <option value="hair">Hair Care</option>
            <option value="skin">Skin Care</option>
            <option value="makeup">Makeup</option>
            <option value="nail">Nail</option>
            <option value="jewellery">Jewellery</option>
            <option value="bridal">Bridal</option>
          </select>
          <button type="submit" class="search-submit-btn"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </form>
    </div>
  </div>

  <!-- AUTH MODAL -->
  <div class="auth-modal-overlay" id="authModalOverlay">
    <div class="auth-modal" id="authModal">
      <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>

      <!-- Promo Banner -->
      <div class="auth-promo-banner">
        <div class="auth-promo-icon"><i class="fa-solid fa-spa"></i></div>
        <h2 class="auth-promo-title">Welcome to SIMPLON Beauty</h2>
        <p class="auth-promo-sub">Sign up &amp; get <strong>10% off</strong> your first order above Rs.2000</p>
      </div>

      <!-- Tabs -->
      <div class="auth-tabs">
        <button class="auth-tab active" id="tabSignup" onclick="switchAuthTab('signup')">Create Account</button>
        <button class="auth-tab" id="tabLogin" onclick="switchAuthTab('login')">Sign In</button>
      </div>

      <!-- SIGN UP FORM -->
      <form class="auth-form" id="authSignupForm" onsubmit="handleSignup(event)">
        <div class="auth-field">
          <i class="fa-solid fa-user auth-field-icon"></i>
          <input type="text" id="signupName" placeholder="Full Name" required/>
        </div>
        <div class="auth-field">
          <i class="fa-solid fa-envelope auth-field-icon"></i>
          <input type="email" id="signupEmail" placeholder="Email Address" required/>
        </div>
        <div class="auth-field">
          <i class="fa-solid fa-phone auth-field-icon"></i>
          <input type="tel" id="signupPhone" placeholder="Phone (+92 xxx xxxxxxx)"/>
        </div>
        <div class="auth-field">
          <i class="fa-solid fa-lock auth-field-icon"></i>
          <input type="password" id="signupPass" placeholder="Password" required/>
        </div>
        <button type="submit" class="auth-submit-btn">Create My Account <i class="fa-solid fa-arrow-right ms-2"></i></button>
        <p class="auth-terms">By signing up, you agree to our <a href="#">Privacy Policy</a> &amp; <a href="#">Terms of Service</a>.</p>
      </form>

      <!-- LOGIN FORM -->
      <form class="auth-form" id="authLoginForm" style="display:none" onsubmit="handleLogin(event)">
        <div class="auth-field">
          <i class="fa-solid fa-envelope auth-field-icon"></i>
          <input type="email" id="loginEmail" placeholder="Email Address" required/>
        </div>
        <div class="auth-field">
          <i class="fa-solid fa-lock auth-field-icon"></i>
          <input type="password" id="loginPass" placeholder="Password" required/>
        </div>
        <button type="submit" class="auth-submit-btn">Sign In <i class="fa-solid fa-arrow-right ms-2"></i></button>
        <p class="auth-terms">Don't have an account? <a href="#" onclick="switchAuthTab('signup'); return false;">Sign up here</a>.</p>
      </form>

      <div class="auth-msg" id="authMsg"></div>
    </div>
  </div>

  <div class="marquee-bar">
    <marquee>
      <i class="fa-solid fa-star me-2"></i>Welcome to SIMPLON Beauty Care — Quality Since 1985
      &nbsp;&nbsp;&nbsp;
      <i class="fa-solid fa-gift me-2"></i>New Wedding Kits Available!
      &nbsp;&nbsp;&nbsp;
      <i class="fa-solid fa-truck me-2"></i>Free Delivery on Orders Above Rs. 2000
      &nbsp;&nbsp;&nbsp;
      <i class="fa-solid fa-wand-sparkles me-2"></i>Upcoming: Winter Skincare Range!
    </marquee>
  </div>`;

  setTimeout(function() {
    // Theme toggle
    var themeBtn = document.getElementById('themeToggleBtn');
    var themeIconEl = document.getElementById('themeIcon');
    if (themeIconEl) {
      themeIconEl.className = document.documentElement.getAttribute('data-theme') === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Search
    var searchBtn = document.getElementById('searchToggleBtn');
    var closeBtn = document.getElementById('searchCloseBtn');
    var overlay = document.getElementById('searchOverlay');
    var searchInput = document.getElementById('navbarSearchInput');
    if (searchBtn && overlay) {
      searchBtn.addEventListener('click', function() {
        overlay.classList.add('active');
        setTimeout(() => searchInput && searchInput.focus(), 300);
      });
    }
    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', function() { overlay.classList.remove('active'); });
    }

    // Profile dropdown toggle (only when logged in)
    var profileToggle = document.getElementById('profileToggle');
    var profileMenu = document.getElementById('profileMenu');
    if (profileToggle && profileMenu) {
      profileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        profileMenu.classList.toggle('open');
      });
      document.addEventListener('click', function() {
        profileMenu.classList.remove('open');
      });
    }

    // Auth modal overlay click to close
    var authOverlay = document.getElementById('authModalOverlay');
    if (authOverlay) {
      authOverlay.addEventListener('click', function(e) {
        if (e.target === authOverlay) closeAuthModal();
      });
    }

    // Cart count
    updateNavbarCartCount();

    // Auto-open auth modal if user not logged in
    if (!getAuthUser()) {
      setTimeout(openAuthModal, 800);
    }
  }, 100);
}

function openAuthModal() {
  var overlay = document.getElementById('authModalOverlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeAuthModal() {
  var overlay = document.getElementById('authModalOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}
function switchAuthTab(tab) {
  var signupForm = document.getElementById('authSignupForm');
  var loginForm  = document.getElementById('authLoginForm');
  var tabSignup  = document.getElementById('tabSignup');
  var tabLogin   = document.getElementById('tabLogin');
  var msg        = document.getElementById('authMsg');
  if (!signupForm || !loginForm) return;
  if (tab === 'signup') {
    signupForm.style.display = 'flex';
    loginForm.style.display  = 'none';
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
  } else {
    signupForm.style.display = 'none';
    loginForm.style.display  = 'flex';
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
  }
  if (msg) { msg.textContent = ''; msg.className = 'auth-msg'; }
}
function handleSignup(e) {
  e.preventDefault();
  var name  = document.getElementById('signupName').value.trim();
  var email = document.getElementById('signupEmail').value.trim().toLowerCase();
  var phone = document.getElementById('signupPhone').value.trim();
  var pass  = document.getElementById('signupPass').value;
  var msg   = document.getElementById('authMsg');
  // Check existing
  var users = JSON.parse(localStorage.getItem('simplon_users') || '[]');
  if (users.find(u => u.email === email)) {
    msg.textContent = 'An account with this email already exists. Please sign in.';
    msg.className = 'auth-msg error';
    switchAuthTab('login');
    return;
  }
  var newUser = { name, email, phone, pass };
  users.push(newUser);
  localStorage.setItem('simplon_users', JSON.stringify(users));
  setAuthUser({ name, email, phone });
  msg.textContent = `Welcome, ${name}! Your account has been created.`;
  msg.className = 'auth-msg success';
  setTimeout(() => { closeAuthModal(); location.reload(); }, 1200);
}
function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value.trim().toLowerCase();
  var pass  = document.getElementById('loginPass').value;
  var msg   = document.getElementById('authMsg');
  var users = JSON.parse(localStorage.getItem('simplon_users') || '[]');
  var found = users.find(u => u.email === email && u.pass === pass);
  if (!found) {
    msg.textContent = 'Incorrect email or password. Please try again.';
    msg.className = 'auth-msg error';
    return;
  }
  setAuthUser({ name: found.name, email: found.email, phone: found.phone });
  msg.textContent = `Welcome back, ${found.name}!`;
  msg.className = 'auth-msg success';
  setTimeout(() => { closeAuthModal(); location.reload(); }, 1000);
}
function logoutUser() {
  clearAuthUser();
  location.reload();
}

function updateNavbarCartCount() {
  var countBadge = document.getElementById('navCartCount');
  if (countBadge) {
    var cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('simplon_cart') || '[]');
    } catch(e) { cart = []; }
    var total = cart.reduce(function(s, i){ return s + i.qty; }, 0);
    countBadge.textContent = total;
    countBadge.style.display = total > 0 ? 'inline-flex' : 'none';
  }
}

function handleNavbarSearch(e) {
  e.preventDefault();
  var query = document.getElementById('navbarSearchInput').value.trim();
  var cat = document.getElementById('navbarSearchCat').value;
  document.getElementById('searchOverlay').classList.remove('active');
  window.location.href = 'products.html?search=' + encodeURIComponent(query) + '&cat=' + encodeURIComponent(cat);
}

// ── FOOTER ──
function renderFooter() {
  document.getElementById('footer-placeholder').innerHTML = `
  <footer>
    <div class="container text-center">
      <div class="footer-brand"><i class="fa-solid fa-spa me-2"></i>SIMPLON Beauty Care</div>
      <div class="social-icons mb-3">
        <a href="https://www.facebook.com/"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="https://www.instagram.com/"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://www.tiktok.com/"><i class="fa-brands fa-tiktok"></i></a>
        <a href="https://wa.me/"><i class="fa-brands fa-whatsapp"></i></a>
      </div>
      <hr class="footer-divider"/>
      <div class="footer-links mb-3">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="products.html">Products</a>
        <a href="order.html">Order</a>
        <a href="gallery.html">Gallery</a>
        <a href="feedback.html">Feedback</a>
        <a href="contact.html">Contact</a>
      </div>
      <p class="footer-copy">© 2024 SIMPLON Beauty Care Centre. All Rights Reserved.</p>
    </div>
  </footer>`;
}

// ── SCROLL TOP ──
function initScrollTop() {
  document.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTop');
    if (btn) btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
}
