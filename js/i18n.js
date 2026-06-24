// Welke taal gebruiken we?
let currentLanguage = "nl"; // Standaardtaal instellen op Nederlands

// Hier komen alle vertalingen in te staan
let translations = {}; // Object waarin de geladen vertalingen worden opgeslagen

// Vertaling ophalen
function t(key) { // Functie om een vertaalkey op te halen
  if (translations[key]) { // Controleer of de vertaling bestaat
    return translations[key]; // Geef de vertaling terug
  } else {
    return key; // Als er niks gevonden wordt, geef de key zelf terug
  }
}

// Alle teksten op de pagina aanpassen
function applyTranslations() { // Pas alle vertaalde teksten op de pagina toe

  let elements = document.querySelectorAll("[data-i18n]"); // Selecteer alle elementen met een data-i18n-attribuut

  for (let i = 0; i < elements.length; i++) { // Loop door alle tekst-elementen
    let el = elements[i]; // Huidig element ophalen
    let key = el.getAttribute("data-i18n"); // De vertaalkey uit het attribuut halen
    el.textContent = t(key); // Vervang de tekst met de vertaling
  }

  let placeholders = document.querySelectorAll("[data-i18n-placeholder]"); // Selecteer alle inputvelden met een placeholder-vertaling

  for (let i = 0; i < placeholders.length; i++) { // Loop door alle placeholder-elementen
    let el = placeholders[i]; // Huidig element ophalen
    let key = el.getAttribute("data-i18n-placeholder"); // De vertaalkey voor de placeholder ophalen
    el.placeholder = t(key); // Stel de placeholder in op de vertaling
  }

  let ariaLabels = document.querySelectorAll("[data-i18n-aria-label]"); // Selecteer alle elementen met een aria-label-vertaling

  for (let i = 0; i < ariaLabels.length; i++) { // Loop door alle aria-label-elementen
    let el = ariaLabels[i]; // Huidig element ophalen
    let key = el.getAttribute("data-i18n-aria-label"); // De vertaalkey voor de aria-label ophalen
    el.setAttribute("aria-label", t(key)); // Stel de aria-label in op de vertaling
  }
}

// Taal laden
async function loadLanguage(lang) { // Laad een specifieke taalbestand

  let response = await fetch("./i18n/" + lang + ".json"); // Haal het taalbestand op uit de i18n-map
  translations = await response.json(); // Zet de JSON-inhoud om in een object

  currentLanguage = lang; // Sla de gekozen taal op

  document.documentElement.lang = lang; // Pas de lang-attribuut van de html-tag aan

  localStorage.setItem("language", lang); // Bewaar de gekozen taal in lokale opslag

  applyTranslations(); // Pas alle vertalingen direct toe op de pagina
}

// Start taal laden
async function initLanguage() { // Initialiseer de taal bij het laden van de pagina
  let saved = localStorage.getItem("language"); // Controleer of er een opgeslagen taal bestaat

  if (saved) { // Als er een opgeslagen taal is
    await loadLanguage(saved); // Laad die taal
  } else {
    await loadLanguage("nl"); // Anders laad standaard het Nederlands
  }
}

// Taal wisselen knop
async function toggleLanguage() { // Wissel tussen Nederlands en Engels
  if (currentLanguage === "nl") { // Als de huidige taal Nederlands is
    await loadLanguage("en"); // Laad Engels
  } else {
    await loadLanguage("nl"); // Anders laad Nederlands
  }
}