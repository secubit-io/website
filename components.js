/* ──────────────────────────────────────────────────────────────
   Shared site chrome (nav + footer) for every page.
   Injected into <div id="site-nav"> / <div id="site-footer">.
   Uses root-relative URLs ("/...") so the SAME markup works at any
   depth (homepage, /blogs/, /blogs/posts/…). The site is served at
   the domain root, so these resolve correctly.
   ────────────────────────────────────────────────────────────── */
(function () {
  // On the homepage, section links stay in-page anchors (smooth scroll);
  // elsewhere they jump to the homepage section.
  const onHome = location.pathname === '/' || location.pathname === '/index.html';
  const sec = id => (onHome ? '#' + id : '/index.html#' + id);

  const navHTML = `
    <nav>
      <a href="/" aria-label="Secubit home" class="nav-brand"><img src="/logo.svg" alt="Secubit" class="nav-logo"></a>
      <div class="nav-right">
        <div class="nav-links" id="nav-links">
          <a href="${sec('features')}">Features</a>
          <a href="${sec('architecture')}">Architecture</a>
          <a href="${sec('api')}">API</a>
          <a href="${sec('about')}">About</a>
          <a href="https://whitepaper.secubit.io/" target="_blank">Whitepaper</a>
          <a href="${sec('blog')}">Blog</a>
          <a href="https://wallet.secubit.io/" target="_blank">Wallet</a>
        </div>
        <a href="${sec('cta')}" class="btn">Join Waitlist</a>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>`;

  // Call-to-action block shared by every blog post (injected into #site-post-cta).
  const postCtaHTML = `
    <section class="post-cta">
      <div class="post-cta-inner">
        <h3>Want hardware-grade assurance, delivered as a service?</h3>
        <p>Join the waitlist for early access to Secubit's institutional WaaS platform.</p>
        <a href="${sec('cta')}" class="btn">Join Waitlist →</a>
      </div>
    </section>`;

  const footerHTML = `
    <footer>
      <div>
        <a href="/"><img src="/logo-footer.svg" alt="Secubit"></a>
        <div class="footer-copy">Self-Sovereign WaaS &copy; ${new Date().getFullYear()} Secubit.io</div>
      </div>
      <div class="footer-links">
        <a href="https://whitepaper.secubit.io/" target="_blank">Whitepaper</a>
        <a href="https://api.secubit.io/docs/" target="_blank">API</a>
        <a href="https://wallet.secubit.io/" target="_blank">Wallet</a>
        <a href="/blogs/">Blog</a>
        <a href="mailto:info@secubit.io">Contact</a>
      </div>
    </footer>`;

  function mount() {
    const navSlot = document.getElementById('site-nav');
    const ctaSlot = document.getElementById('site-post-cta');
    const footSlot = document.getElementById('site-footer');
    if (navSlot) navSlot.outerHTML = navHTML;
    if (ctaSlot) ctaSlot.outerHTML = postCtaHTML;
    if (footSlot) footSlot.outerHTML = footerHTML;

    /* Nav background on scroll */
    const nav = document.querySelector('nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Mobile hamburger menu */
    const toggle = nav && nav.querySelector('.nav-toggle');
    const links = nav && nav.querySelector('.nav-links');
    if (toggle && links) {
      const setOpen = (open) => {
        nav.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      toggle.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
      // Close the menu after tapping a link.
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    }

    /* Scroll reveal (shared by every page) */
    const revealEls = document.querySelectorAll('.reveal');
    const showAll = () => revealEls.forEach(e => e.classList.add('visible'));
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(el => obs.observe(el));
      // Safety net: never leave content hidden if the observer doesn't fire.
      window.addEventListener('load', () => setTimeout(showAll, 1500));
    } else {
      showAll();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
