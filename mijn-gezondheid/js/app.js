// Mijn Gezondheid — simpele versie
// Data wordt lokaal opgeslagen in de browser (LocalStorage)

// Sla de sleutel op voor de lokale opslag van alle invoeritems.
const STORAGE_KEY = 'mijngezondheid:entries';
// Definieer de beschikbare categorieën voor de app.
const CATEGORIES = ['voeding', 'beweging', 'slaap', 'overig'];

// Behoud alle opgeslagen items in een array.
let entries = [];
// Houd bij welke periode momenteel in het overzicht wordt getoond.
let currentPeriod = 'dag';
// Houd bij welke view momenteel zichtbaar is.
let currentView = 'dashboard';

// Schakel tussen de verschillende schermen van de app.
function setActiveView(viewName) {
  // Zet de actieve view in de variabele.
  currentView = viewName;

  // Toon alleen de view die overeenkomt met de gekozen naam.
  document.querySelectorAll('.view').forEach(view => {
    // Verberg de view als deze niet de actieve is.
    view.hidden = view.dataset.view !== viewName;
  });

  // Markeer de juiste tabknop als actief.
  document.querySelectorAll('.tab-btn').forEach(btn => {
    // Bepaal of deze knop de huidige view bevat.
    const isActive = btn.dataset.target === viewName;
    // Zet het aria-current attribuut op true of false.
    btn.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

// --------------------------------------------------
// Opslag
// --------------------------------------------------
// Laad alle opgeslagen entries uit de lokale browseropslag.
function loadEntries() {
  // Lees de opgeslagen data op basis van de sleutel.
  const data = localStorage.getItem(STORAGE_KEY);
  // Geef de data terug als JSON, anders een lege lijst.
  return data ? JSON.parse(data) : [];
}

// Sla de huidige entries weer op in de lokale browseropslag.
function saveEntries() {
  // Zet de array om naar een string en sla die op.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// --------------------------------------------------
// Datum helpers
// --------------------------------------------------
// Haal de datum van vandaag op in het formaat YYYY-MM-DD.
function getToday() {
  // Maak een nieuw datumobject aan.
  const d = new Date();
  // Converteer de datum naar een standaard stringvorm.
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// --------------------------------------------------
// Filteren per periode
// --------------------------------------------------
// Filter de entries op basis van de gekozen periode.
function filterEntries(period) {
  // Maak een datumobject voor vandaag zonder tijd.
  const today = new Date();
  // Zet de tijd op middernacht om vergelijkingen te vereenvoudigen.
  today.setHours(0, 0, 0, 0);

  // Retourneer alleen die entries die voldoen aan de periode.
  return entries.filter(entry => {
    // Maak van de entry-datum weer een datumobject.
    const date = new Date(entry.date);
    // Zet ook deze datum op middernacht.
    date.setHours(0, 0, 0, 0);

    // Bij de dag-periode wordt gekeken of de datum gelijk is aan vandaag.
    if (period === 'dag') {
      return entry.date === getToday();
    }

    // Bij de week-periode wordt gekeken hoeveel dagen geleden de entry is toegevoegd.
    if (period === 'week') {
      // Bereken het aantal dagen tussen vandaag en de entry-datum.
      const diff = (today - date) / (1000 * 60 * 60 * 24);
      // Neem alleen items van de afgelopen zeven dagen.
      return diff >= 0 && diff < 7;
    }

    // Bij de maand-periode wordt gekeken of de entry in dezelfde maand en jaar valt.
    if (period === 'maand') {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }

    // Als er geen geldige periode is, laat alles zien.
    return true;
  });
}

// Haal alleen de items van vandaag op.
function getTodayEntries() {
  // Roep de filterfunctie aan met de periode dag.
  return filterEntries('dag');
}

// --------------------------------------------------
// Dashboard
// --------------------------------------------------
// Render het dashboard met de samenvatting van vandaag.
function renderDashboard() {
  // Pak alle entries van vandaag.
  const todayEntries = getTodayEntries();

  // Initialiseer de optellingen voor de statistieken.
  let kcal = 0;
  let beweging = 0;
  let slaap = 0;

  // Loop door alle items van vandaag en tel ze bij elkaar op.
  todayEntries.forEach(e => {
    // Tel calorieën bij elkaar op als het type kcal is.
    if (e.valueType === 'kcal') kcal += Number(e.value);

    // Tel bewegingsminuten op voor de categorie beweging.
    if (e.category === 'beweging' && e.valueType === 'duur') {
      beweging += Number(e.value);
    }

    // Tel slaapminuten op voor de categorie slaap.
    if (e.category === 'slaap' && e.valueType === 'duur') {
      slaap += Number(e.value);
    }
  });

  // Vul de cijfers in op het dashboard.
  document.getElementById('stat-kcal').textContent = kcal;
  document.getElementById('stat-beweging').textContent = beweging;
  document.getElementById('stat-slaap').textContent = (slaap / 60).toFixed(1);
  document.getElementById('stat-aantal').textContent = todayEntries.length;

  // Teken daarna de categoriebalken.
  renderCategoryBars(todayEntries);
}

// Render de balken die per categorie laten zien hoeveel items er zijn.
function renderCategoryBars(todayEntries) {
  // Start een teller per categorie op nul.
  const counts = {
    voeding: 0,
    beweging: 0,
    slaap: 0,
    overig: 0
  };

  // Tel hoeveel items er in elke categorie zitten.
  todayEntries.forEach(e => {
    counts[e.category]++;
  });

  // Bepaal het totaal aantal items.
  const total = todayEntries.length;
  // Vind de container waarin de balken moeten komen.
  const container = document.getElementById('category-bars');

  // Toon een melding als er nog geen data is.
  if (total === 0) {
    container.innerHTML = `<p>Geen data vandaag</p>`;
    return;
  }

  // Bouw de HTML voor de categoriebalken.
  let html = '';

  // Loop door alle categorieën en maak voor elke een balk.
  CATEGORIES.forEach(cat => {
    // Bereken hoeveel procent van het totaal deze categorie inneemt.
    const percent = Math.round((counts[cat] / total) * 100);

    // Voeg een balk toe aan de HTML-string.
    html += `
      <div>
        <strong>${cat}</strong>
        <div style="background:#eee; width:100%; height:10px;">
          <div style="width:${percent}%; background:green; height:10px;"></div>
        </div>
        <small>${counts[cat]}</small>
      </div>
    `;
  });

  // Plaats de opgebouwde HTML in de container.
  container.innerHTML = html;
}

// --------------------------------------------------
// Overzicht
// --------------------------------------------------
// Render het overzicht met alle entries voor de gekozen periode.
function renderOverview() {
  // Haal de entries op die passen bij de huidige periode.
  const list = filterEntries(currentPeriod);

  // Vind de lijstcontainer in de DOM.
  const container = document.getElementById('entry-list');
  // Maak de lijst eerst leeg voordat je nieuwe items toevoegt.
  container.innerHTML = '';

  // Toon een lege-status als er geen items zijn.
  if (list.length === 0) {
    container.innerHTML = '<p>Geen entries</p>';
    return;
  }

  // Maak voor elk item een card in het overzicht.
  list.forEach(entry => {
    // Maak een nieuw div-element aan voor de entry.
    const div = document.createElement('div');
    // Geef het element de passende CSS-klasse.
    div.className = 'entry';

    // Vul het div met de inhoud van de entry.
    div.innerHTML = `
      <span>${entry.date}</span>
      <strong>${entry.description}</strong>
      <span>${entry.value} ${entry.valueType}</span>
      <button data-id="${entry.id}">Verwijder</button>
    `;

    // Voeg de entry toe aan de lijstcontainer.
    container.appendChild(div);
  });
}

// --------------------------------------------------
// Verwijderen
// --------------------------------------------------
// Luister naar clicks inside de entrylijst en verwijder een item als op de knop wordt geklikt.
document.getElementById('entry-list').addEventListener('click', (e) => {
  // Controleer of de gebruiker op een knop heeft geklikt.
  if (e.target.tagName === 'BUTTON') {
    // Haal de id van de knop op.
    const id = e.target.dataset.id;

    // Verwijder het item met deze id uit de array.
    entries = entries.filter(e => e.id !== id);
    // Sla de aangepaste lijst op.
    saveEntries();
    // Werk het dashboard bij.
    renderDashboard();
    // Werk het overzicht bij.
    renderOverview();
  }
});

// --------------------------------------------------
// Formulier
// --------------------------------------------------
// Luister naar het verzenden van het invoerformulier.
document.getElementById('entry-form').addEventListener('submit', (e) => {
  // Voorkom dat de pagina standaard herlaadt.
  e.preventDefault();

  // Maak een nieuw object voor de ingevoerde gegevens.
  const newEntry = {
    // Geef een unieke id aan het item.
    id: Date.now().toString(),
    // Pak de ingevoerde datum.
    date: document.getElementById('input-date').value,
    // Pak de gekozen categorie.
    category: document.getElementById('input-category').value,
    // Pak de omschrijving.
    description: document.getElementById('input-description').value,
    // Zet de ingevoerde waarde om naar een getal.
    value: Number(document.getElementById('input-value').value),
    // Pak het gekozen waarde-type.
    valueType: document.querySelector('input[name="valueType"]:checked').value
  };

  // Voeg het nieuwe item toe aan de array.
  entries.push(newEntry);
  // Sla de lijst op.
  saveEntries();

  // Reset het formulier.
  e.target.reset();
  // Stel de datum weer in op vandaag.
  document.getElementById('input-date').value = getToday();

  // Werk de weergaves bij.
  renderDashboard();
  renderOverview();
});

// --------------------------------------------------
// Tabs (dag / week / maand)
// --------------------------------------------------
// Voeg een click-handler toe aan de periodeknoppen.
document.querySelectorAll('.period-tab').forEach(btn => {
  // Luister naar een klik op de knop.
  btn.addEventListener('click', () => {
    // Zet de nieuwe periode in de variabele.
    currentPeriod = btn.dataset.period;
    // Markeer de gekozen periode als actief.
    document.querySelectorAll('.period-tab').forEach(tab => {
      tab.setAttribute('aria-current', tab === btn ? 'true' : 'false');
    });
    // Render het overzicht opnieuw met de nieuwe periode.
    renderOverview();
  });
});

// --------------------------------------------------
// Hoofdnavigeatie en snelle acties
// --------------------------------------------------
// Voeg een click-handler toe aan de tabknoppen voor de hoofdnavigatie.
document.querySelectorAll('.tab-btn').forEach(btn => {
  // Wanneer een tab wordt geklikt, wissel van view.
  btn.addEventListener('click', () => {
    setActiveView(btn.dataset.target);
  });
});

// Voeg een click-handler toe aan de snelle-toevoegen-knoppen.
document.querySelectorAll('.quickadd-btn').forEach(btn => {
  // Wanneer een knop wordt geklikt, open het invoerscherm.
  btn.addEventListener('click', () => {
    // Pak de categorie uit het data-attribuut.
    const category = btn.dataset.quickadd || 'voeding';
    // Stel de categorie in het formulier in.
    document.getElementById('input-category').value = category;
    // Ga naar het add-scherm.
    setActiveView('add');
    // Focus de omschrijving in het formulier.
    document.getElementById('input-description').focus();
  });
});

// Luister naar klikken op de taalwisselknop.
document.getElementById('lang-toggle').addEventListener('click', async () => {
  // Wissel de taal van de app.
  await toggleLanguage();
});

// --------------------------------------------------
// Start
// --------------------------------------------------
// Initialiseer de app wanneer de pagina is geladen.
function init() {
  // Laad bestaande entries uit opslag.
  entries = loadEntries();

  // Stel de standaard datum in op vandaag.
  document.getElementById('input-date').value = getToday();
  // Toon de eerste view bij het opstarten.
  setActiveView(currentView);

  // Render de dashboard- en overzichtweergaven.
  renderDashboard();
  renderOverview();
  // Laad de taalinstellingen van de app.
  initLanguage().catch(console.error);
}

// Start de app zodra de DOM klaar is.
document.addEventListener('DOMContentLoaded', init);