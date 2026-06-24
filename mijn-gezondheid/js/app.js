// Mijn Gezondheid — simpele versie
// Data wordt lokaal opgeslagen in de browser (LocalStorage)

const STORAGE_KEY = 'mijngezondheid:entries';
const CATEGORIES = ['voeding', 'beweging', 'slaap', 'overig'];

let entries = [];
let currentPeriod = 'dag';
let currentView = 'dashboard';

function setActiveView(viewName) {
  currentView = viewName;

  document.querySelectorAll('.view').forEach(view => {
    view.hidden = view.dataset.view !== viewName;
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.dataset.target === viewName;
    btn.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

// --------------------------------------------------
// Opslag
// --------------------------------------------------
function loadEntries() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// --------------------------------------------------
// Datum helpers
// --------------------------------------------------
function getToday() {
  const d = new Date();
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// --------------------------------------------------
// Filteren per periode
// --------------------------------------------------
function filterEntries(period) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return entries.filter(entry => {
    const date = new Date(entry.date);
    date.setHours(0, 0, 0, 0);

    if (period === 'dag') {
      return entry.date === getToday();
    }

    if (period === 'week') {
      const diff = (today - date) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff < 7;
    }

    if (period === 'maand') {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }

    return true;
  });
}

function getTodayEntries() {
  return filterEntries('dag');
}

// --------------------------------------------------
// Dashboard
// --------------------------------------------------
function renderDashboard() {
  const todayEntries = getTodayEntries();

  let kcal = 0;
  let beweging = 0;
  let slaap = 0;

  todayEntries.forEach(e => {
    if (e.valueType === 'kcal') kcal += Number(e.value);

    if (e.category === 'beweging' && e.valueType === 'duur') {
      beweging += Number(e.value);
    }

    if (e.category === 'slaap' && e.valueType === 'duur') {
      slaap += Number(e.value);
    }
  });

  document.getElementById('stat-kcal').textContent = kcal;
  document.getElementById('stat-beweging').textContent = beweging;
  document.getElementById('stat-slaap').textContent = (slaap / 60).toFixed(1);
  document.getElementById('stat-aantal').textContent = todayEntries.length;

  renderCategoryBars(todayEntries);
}

function renderCategoryBars(todayEntries) {
  const counts = {
    voeding: 0,
    beweging: 0,
    slaap: 0,
    overig: 0
  };

  todayEntries.forEach(e => {
    counts[e.category]++;
  });

  const total = todayEntries.length;
  const container = document.getElementById('category-bars');

  if (total === 0) {
    container.innerHTML = `<p>Geen data vandaag</p>`;
    return;
  }

  let html = '';

  CATEGORIES.forEach(cat => {
    const percent = Math.round((counts[cat] / total) * 100);

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

  container.innerHTML = html;
}

// --------------------------------------------------
// Overzicht
// --------------------------------------------------
function renderOverview() {
  const list = filterEntries(currentPeriod);

  const container = document.getElementById('entry-list');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p>Geen entries</p>';
    return;
  }

  list.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'entry';

    div.innerHTML = `
      <span>${entry.date}</span>
      <strong>${entry.description}</strong>
      <span>${entry.value} ${entry.valueType}</span>
      <button data-id="${entry.id}">Verwijder</button>
    `;

    container.appendChild(div);
  });
}

// --------------------------------------------------
// Verwijderen
// --------------------------------------------------
document.getElementById('entry-list').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.dataset.id;

    entries = entries.filter(e => e.id !== id);
    saveEntries();
    renderDashboard();
    renderOverview();
  }
});

// --------------------------------------------------
// Formulier
// --------------------------------------------------
document.getElementById('entry-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const newEntry = {
    id: Date.now().toString(),
    date: document.getElementById('input-date').value,
    category: document.getElementById('input-category').value,
    description: document.getElementById('input-description').value,
    value: Number(document.getElementById('input-value').value),
    valueType: document.querySelector('input[name="valueType"]:checked').value
  };

  entries.push(newEntry);
  saveEntries();

  e.target.reset();
  document.getElementById('input-date').value = getToday();

  renderDashboard();
  renderOverview();
});

// --------------------------------------------------
// Tabs (dag / week / maand)
// --------------------------------------------------
document.querySelectorAll('.period-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    currentPeriod = btn.dataset.period;
    document.querySelectorAll('.period-tab').forEach(tab => {
      tab.setAttribute('aria-current', tab === btn ? 'true' : 'false');
    });
    renderOverview();
  });
});

// --------------------------------------------------
// Hoofdnavigeatie en snelle acties
// --------------------------------------------------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setActiveView(btn.dataset.target);
  });
});

document.querySelectorAll('.quickadd-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.quickadd || 'voeding';
    document.getElementById('input-category').value = category;
    setActiveView('add');
    document.getElementById('input-description').focus();
  });
});

document.getElementById('lang-toggle').addEventListener('click', async () => {
  await toggleLanguage();
});

// --------------------------------------------------
// Start
// --------------------------------------------------
function init() {
  entries = loadEntries();

  document.getElementById('input-date').value = getToday();
  setActiveView(currentView);

  renderDashboard();
  renderOverview();
  initLanguage().catch(console.error);
}

document.addEventListener('DOMContentLoaded', init);