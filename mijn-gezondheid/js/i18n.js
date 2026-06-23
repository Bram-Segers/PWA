// Welke taal gebruiken we?
let currentLanguage = "nl";

// Hier komen alle vertalingen in te staan
let translations = {};

// Vertaling ophalen
function t(key) {
  if (translations[key]) {
    return translations[key];
  } else {
    return key; // als er niks gevonden wordt
  }
}

// Alle teksten op de pagina aanpassen
function applyTranslations() {

  let elements = document.querySelectorAll("[data-i18n]");

  for (let i = 0; i < elements.length; i++) {
    let el = elements[i];
    let key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  }

  let placeholders = document.querySelectorAll("[data-i18n-placeholder]");

  for (let i = 0; i < placeholders.length; i++) {
    let el = placeholders[i];
    let key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  }

  let ariaLabels = document.querySelectorAll("[data-i18n-aria-label]");

  for (let i = 0; i < ariaLabels.length; i++) {
    let el = ariaLabels[i];
    let key = el.getAttribute("data-i18n-aria-label");
    el.setAttribute("aria-label", t(key));
  }
}

// Taal laden
async function loadLanguage(lang) {

  let response = await fetch("./i18n/" + lang + ".json");
  translations = await response.json();

  currentLanguage = lang;

  document.documentElement.lang = lang;

  localStorage.setItem("language", lang);

  applyTranslations();
}

// Start taal laden
async function initLanguage() {
  let saved = localStorage.getItem("language");

  if (saved) {
    await loadLanguage(saved);
  } else {
    await loadLanguage("nl");
  }
}

// Taal wisselen knop
async function toggleLanguage() {
  if (currentLanguage === "nl") {
    await loadLanguage("en");
  } else {
    await loadLanguage("nl");
  }
}