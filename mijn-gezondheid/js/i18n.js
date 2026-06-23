// Mijn Gezondheid — i18n.js
// Laadt de teksten uit i18n/nl.json of i18n/en.json en zet ze in de pagina.
// Elementen met data-i18n="sleutel" krijgen de bijbehorende tekst.

const LANG_KEY = 'mijngezondheid:lang';

let translations = {};
let currentLang = 'nl';

// Haalt een vertaalde tekst op via een sleutel, bijv. t('form.submit')
function t(key) {
  return translations[key] !== undefined ? translations[key] : key;
}

// Zet alle data-i18n teksten en placeholders in de pagina volgens de
// geladen taal.
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    el.setAttribute('aria-label', t(key));
  });
}

// Laadt een taalbestand (nl.json of en.json) en past de teksten toe.
async function loadLanguage(lang) {
  const response = await fetch(`./i18n/${lang}.json`);
  translations = await response.json();
  currentLang = lang;

  document.documentElement.lang = lang;
  localStorage.setItem(LANG_KEY, lang);

  applyTranslations();
}

// Wordt één keer aangeroepen bij het opstarten van de app.
async function initLanguage() {
  const savedLang = localStorage.getItem(LANG_KEY) || 'nl';
  await loadLanguage(savedLang);
}

// Wisselt tussen Nederlands en Engels.
async function toggleLanguage() {
  const nextLang = currentLang === 'nl' ? 'en' : 'nl';
  await loadLanguage(nextLang);
}
