// Welke taal gebruiken we?
// Uitleg: let currentLanguage = "nl"; // Standaardtaal instellen op Nederlands
let currentLanguage = "nl"; // Standaardtaal instellen op Nederlands

// Hier komen alle vertalingen in te staan
// Uitleg: let translations = {}; // Object waarin de geladen vertalingen worden opgeslagen
let translations = {}; // Object waarin de geladen vertalingen worden opgeslagen

// Vertaling ophalen
// Uitleg: function t(key) { // Functie om een vertaalkey op te halen
function t(key) { // Functie om een vertaalkey op te halen
  // Uitleg: if (translations[key]) { // Controleer of de vertaling bestaat
  if (translations[key]) { // Controleer of de vertaling bestaat
    // Uitleg: return translations[key]; // Geef de vertaling terug
    return translations[key]; // Geef de vertaling terug
  // Uitleg: } else {
  } else {
    // Uitleg: return key; // Als er niks gevonden wordt, geef de key zelf terug
    return key; // Als er niks gevonden wordt, geef de key zelf terug
  // Uitleg: }
  }
// Uitleg: }
}

// Alle teksten op de pagina aanpassen
// Uitleg: function applyTranslations() { // Pas alle vertaalde teksten op de pagina toe
function applyTranslations() { // Pas alle vertaalde teksten op de pagina toe

  // Uitleg: let elements = document.querySelectorAll("[data-i18n]"); // Selecteer alle elementen met een data-i18n-attribuut
  let elements = document.querySelectorAll("[data-i18n]"); // Selecteer alle elementen met een data-i18n-attribuut

  // Uitleg: for (let i = 0; i < elements.length; i++) { // Loop door alle tekst-elementen
  for (let i = 0; i < elements.length; i++) { // Loop door alle tekst-elementen
    // Uitleg: let el = elements[i]; // Huidig element ophalen
    let el = elements[i]; // Huidig element ophalen
    // Uitleg: let key = el.getAttribute("data-i18n"); // De vertaalkey uit het attribuut halen
    let key = el.getAttribute("data-i18n"); // De vertaalkey uit het attribuut halen
    // Uitleg: el.textContent = t(key); // Vervang de tekst met de vertaling
    el.textContent = t(key); // Vervang de tekst met de vertaling
  // Uitleg: }
  }

  // Uitleg: let placeholders = document.querySelectorAll("[data-i18n-placeholder]"); // Selecteer alle inputvelden met een placeholder-vertaling
  let placeholders = document.querySelectorAll("[data-i18n-placeholder]"); // Selecteer alle inputvelden met een placeholder-vertaling

  // Uitleg: for (let i = 0; i < placeholders.length; i++) { // Loop door alle placeholder-elementen
  for (let i = 0; i < placeholders.length; i++) { // Loop door alle placeholder-elementen
    // Uitleg: let el = placeholders[i]; // Huidig element ophalen
    let el = placeholders[i]; // Huidig element ophalen
    // Uitleg: let key = el.getAttribute("data-i18n-placeholder"); // De vertaalkey voor de placeholder ophalen
    let key = el.getAttribute("data-i18n-placeholder"); // De vertaalkey voor de placeholder ophalen
    // Uitleg: el.placeholder = t(key); // Stel de placeholder in op de vertaling
    el.placeholder = t(key); // Stel de placeholder in op de vertaling
  // Uitleg: }
  }

  // Uitleg: let ariaLabels = document.querySelectorAll("[data-i18n-aria-label]"); // Selecteer alle elementen met een aria-label-vertaling
  let ariaLabels = document.querySelectorAll("[data-i18n-aria-label]"); // Selecteer alle elementen met een aria-label-vertaling

  // Uitleg: for (let i = 0; i < ariaLabels.length; i++) { // Loop door alle aria-label-elementen
  for (let i = 0; i < ariaLabels.length; i++) { // Loop door alle aria-label-elementen
    // Uitleg: let el = ariaLabels[i]; // Huidig element ophalen
    let el = ariaLabels[i]; // Huidig element ophalen
    // Uitleg: let key = el.getAttribute("data-i18n-aria-label"); // De vertaalkey voor de aria-label ophalen
    let key = el.getAttribute("data-i18n-aria-label"); // De vertaalkey voor de aria-label ophalen
    // Uitleg: el.setAttribute("aria-label", t(key)); // Stel de aria-label in op de vertaling
    el.setAttribute("aria-label", t(key)); // Stel de aria-label in op de vertaling
  // Uitleg: }
  }
// Uitleg: }
}

// Taal laden
// Uitleg: async function loadLanguage(lang) { // Laad een specifieke taalbestand
async function loadLanguage(lang) { // Laad een specifieke taalbestand

  // Uitleg: let response = await fetch("./i18n/" + lang + ".json"); // Haal het taalbestand op uit de i18n-map
  let response = await fetch("./i18n/" + lang + ".json"); // Haal het taalbestand op uit de i18n-map
  // Uitleg: translations = await response.json(); // Zet de JSON-inhoud om in een object
  translations = await response.json(); // Zet de JSON-inhoud om in een object

  // Uitleg: currentLanguage = lang; // Sla de gekozen taal op
  currentLanguage = lang; // Sla de gekozen taal op

  // Uitleg: document.documentElement.lang = lang; // Pas de lang-attribuut van de html-tag aan
  document.documentElement.lang = lang; // Pas de lang-attribuut van de html-tag aan

  // Uitleg: localStorage.setItem("language", lang); // Bewaar de gekozen taal in lokale opslag
  localStorage.setItem("language", lang); // Bewaar de gekozen taal in lokale opslag

  // Uitleg: applyTranslations(); // Pas alle vertalingen direct toe op de pagina
  applyTranslations(); // Pas alle vertalingen direct toe op de pagina
// Uitleg: }
}

// Start taal laden
// Uitleg: async function initLanguage() { // Initialiseer de taal bij het laden van de pagina
async function initLanguage() { // Initialiseer de taal bij het laden van de pagina
  // Uitleg: let saved = localStorage.getItem("language"); // Controleer of er een opgeslagen taal bestaat
  let saved = localStorage.getItem("language"); // Controleer of er een opgeslagen taal bestaat

  // Uitleg: if (saved) { // Als er een opgeslagen taal is
  if (saved) { // Als er een opgeslagen taal is
    // Uitleg: await loadLanguage(saved); // Laad die taal
    await loadLanguage(saved); // Laad die taal
  // Uitleg: } else {
  } else {
    // Uitleg: await loadLanguage("nl"); // Anders laad standaard het Nederlands
    await loadLanguage("nl"); // Anders laad standaard het Nederlands
  // Uitleg: }
  }
// Uitleg: }
}

// Taal wisselen knop
// Uitleg: async function toggleLanguage() { // Wissel tussen Nederlands en Engels
async function toggleLanguage() { // Wissel tussen Nederlands en Engels
  // Uitleg: if (currentLanguage === "nl") { // Als de huidige taal Nederlands is
  if (currentLanguage === "nl") { // Als de huidige taal Nederlands is
    // Uitleg: await loadLanguage("en"); // Laad Engels
    await loadLanguage("en"); // Laad Engels
  // Uitleg: } else {
  } else {
    // Uitleg: await loadLanguage("nl"); // Anders laad Nederlands
    await loadLanguage("nl"); // Anders laad Nederlands
  // Uitleg: }
  }
// Uitleg: }
}