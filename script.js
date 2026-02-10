/* =========================
   JS simples:
   - Ano automático no footer
   - Menu mobile abre/fecha
   ========================= */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

function closeMobileNav() {
  if (!mobileNav || !menuBtn) return;
  mobileNav.style.display = "none";
  menuBtn.setAttribute("aria-expanded", "false");
}

function toggleMobileNav() {
  if (!mobileNav || !menuBtn) return;

  const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMobileNav();
  } else {
    mobileNav.style.display = "block";
    menuBtn.setAttribute("aria-expanded", "true");
  }
}

if (menuBtn) {
  menuBtn.addEventListener("click", toggleMobileNav);
}

/* Fecha menu ao clicar em um link */
if (mobileNav) {
  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMobileNav);
  });
}

/* Fecha menu ao redimensionar para desktop */
window.addEventListener("resize", () => {
  if (window.innerWidth > 940) closeMobileNav();
});

/* =========================
   LIGHTBOX (Resultados)
   - clique abre
   - setas / teclado / swipe
   ========================= */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightboxImg");
const lbCaption = document.getElementById("lightboxCaption");

const galleryImgs = Array.from(document.querySelectorAll('img[data-gallery="results"]'));
let currentIndex = 0;

function lbOpen(index) {
  if (!lb || !lbImg || !galleryImgs.length) return;

  currentIndex = index;
  const img = galleryImgs[currentIndex];

  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt || "Imagem do resultado";
  if (lbCaption) lbCaption.textContent = img.alt || "";

  lb.classList.add("is-open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function lbClose() {
  if (!lb) return;
  lb.classList.remove("is-open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function lbShow(delta) {
  if (!galleryImgs.length || !lbImg) return;

  currentIndex = (currentIndex + delta + galleryImgs.length) % galleryImgs.length;
  const img = galleryImgs[currentIndex];

  // troca suave
  lbImg.style.opacity = "0";
  lbImg.style.transform = "scale(.99)";

  window.setTimeout(() => {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || "Imagem do resultado";
    if (lbCaption) lbCaption.textContent = img.alt || "";

    lbImg.style.opacity = "1";
    lbImg.style.transform = "scale(1)";
  }, 130);
}

// abrir ao clicar nas imagens
galleryImgs.forEach((img, idx) => {
  img.style.cursor = "pointer";
  img.addEventListener("click", () => lbOpen(idx));
});

// fechar (overlay e botão)
document.querySelectorAll("[data-lb-close]").forEach((el) => {
  el.addEventListener("click", lbClose);
});

// setas
const prevBtn = document.querySelector("[data-lb-prev]");
const nextBtn = document.querySelector("[data-lb-next]");
if (prevBtn) prevBtn.addEventListener("click", () => lbShow(-1));
if (nextBtn) nextBtn.addEventListener("click", () => lbShow(1));

// teclado
window.addEventListener("keydown", (e) => {
  if (!lb || !lb.classList.contains("is-open")) return;
  if (e.key === "Escape") lbClose();
  if (e.key === "ArrowLeft") lbShow(-1);
  if (e.key === "ArrowRight") lbShow(1);
});

// swipe no mobile
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) < 40) return;
  if (diff > 0) lbShow(1);
  else lbShow(-1);
}

if (lbImg) {
  lbImg.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lbImg.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}
