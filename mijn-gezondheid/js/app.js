// Mijn Gezondheid — app.js
// Alle logica voor het bijhouden van gezondheidsonderdelen.
// Data wordt volledig lokaal opgeslagen in LocalStorage (F6) — geen server nodig.

const STORAGE_KEY = 'mijngezondheid:entries';
const CATEGORIES = ['voeding', 'beweging', 'slaap', 'overig'];

// ---------------------------------------------------------------------------
// Opslag (LocalStorage) — F6
// ---------------------------------------------------------------------------
function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveEntries(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let entries = loadEntries();
let currentPeriod = 'dag';

// ---------------------------------------------------------------------------
// Datumhelpers
// ---------------------------------------------------------------------------
function formatISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayISO() {
  return formatISO(new Date());
}

function formatDisplayDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  const locale = currentLang === 'nl' ? 'nl-NL' : 'en-GB';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

// F2 — overzicht per periode: dag, week of maand
function filterByPeriod(list, period) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return list.filter((entry) => {
    const entryDate = new Date(`${entry.date}T00:00:00`);

    if (period === 'dag') {
      return formatISO(entryDate) === formatISO(today);
    }
    if (period === 'week') {
      const diffDays = Math.floor((today - entryDate) / 86400000);
      return diffDays >= 0 && diffDays < 7;
    }
    if (period === 'maand') {
      return entryDate.getFullYear() === today.getFullYear()
        && entryDate.getMonth() === today.getMonth();
    }
    return true;
  });
}

function getTodayEntries() {
  return filterByPeriod(entries, 'dag');
}

// ---------------------------------------------------------------------------
// Dashboard: balkjes per categorie + statistieken van vandaag
// ---------------------------------------------------------------------------
function renderTodayBars() {
  const todayEntries = getTodayEntries();
  const total = todayEntries.length;
  const container = document.getElementById('category-bars');

  if (total === 0) {
    container.innerHTML = `<p class="empty-hint">${t('dashboard.emptyHint')}</p>`;
    return;
  }

  // Tel hoeveel onderdelen er per categorie zijn ingevoerd vandaag.
  const counts = { voeding: 0, beweging: 0, slaap: 0, overig: 0 };
  todayEntries.forEach((entry) => { counts[entry.category] += 1; });

  let html = '';
  CATEGORIES.forEach((cat) => {
    const percent = Math.round((counts[cat] / total) * 100);
    html += `
      <div class="bar-row">
        <span class="bar-label"><span class="dot" style="background:var(--color-${cat})"></span>${t(`category.${cat}`)}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${percent}%; background:var(--color-${cat})"></div>
        </div>
        <span class="bar-count">${counts[cat]}</span>
      </div>`;
  });
  container.innerHTML = html;
}

function renderStats() {
  const todayEntries = getTodayEntries();

  const kcal = todayEntries
    .filter((e) => e.valueType === 'kcal')
    .reduce((sum, e) => sum + Number(e.value), 0);

  const bewegingMin = todayEntries
    .filter((e) => e.category === 'beweging' && e.valueType === 'duur')
    .reduce((sum, e) => sum + Number(e.value), 0);

  const slaapMin = todayEntries
    .filter((e) => e.category === 'slaap' && e.valueType === 'duur')
    .reduce((sum, e) => sum + Number(e.value), 0);

  document.getElementById('stat-kcal').textContent = kcal;
  document.getElementById('stat-beweging').textContent = bewegingMin;
  document.getElementById('stat-slaap').textContent = slaapMin > 0 ? (slaapMin / 60).toFixed(1) : 0;
  document.getElementById('stat-aantal').textContent = todayEntries.length;
}

function renderDashboard() {
  renderTodayBars();
  renderStats();
}

// ---------------------------------------------------------------------------
// Overzicht — F2 (Read per periode) en F3 (Delete/Reset specifiek item)
// ---------------------------------------------------------------------------
function renderOverview() {
  const filtered = filterByPeriod(entries, currentPeriod)
    .slice()
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1; // nieuwste datum eerst
      return b.createdAt - a.createdAt; // bij gelijke datum: laatst toegevoegd eerst
    });

  const kcalTotal = filtered.filter((e) => e.valueType === 'kcal').reduce((s, e) => s + Number(e.value), 0);
  const duurTotal = filtered.filter((e) => e.valueType === 'duur').reduce((s, e) => s + Number(e.value), 0);

  document.getElementById('summary-kcal').textContent = kcalTotal;
  document.getElementById('summary-duur').textContent = duurTotal;
  document.getElementById('summary-aantal').textContent = filtered.length;

  const list = document.getElementById('entry-list');

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6" stroke-linecap="round"/></svg>
        <p><strong>${t('overview.emptyTitle')}</strong></p>
        <p>${t('overview.emptyHint')}</p>
      </div>`;
    return;
  }

  let html = '';
  filtered.forEach((entry) => {
    const unit = t(`unit.${entry.valueType}`);
    const dateLabel = currentPeriod === 'dag' ? '' : ` · ${formatDisplayDate(entry.date)}`;

    html += `
      <div class="entry-card">
        <span class="dot" style="background:var(--color-${entry.category})"></span>
        <div class="entry-main">
          <div class="entry-desc">${entry.description}</div>
          <div class="entry-meta">${t(`category.${entry.category}`)}${dateLabel}</div>
        </div>
        <div class="entry-value">${entry.value} ${unit}</div>
        <button class="entry-delete" data-delete-id="${entry.id}" aria-label="${t('overview.deleteLabel')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/></svg>
        </button>
      </div>`;
  });
  list.innerHTML = html;
}

document.getElementById('entry-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-id]');
  if (!button) return;

  const idToDelete = button.getAttribute('data-delete-id');
  if (window.confirm(t('overview.deleteConfirm'))) {
    entries = entries.filter((entry) => entry.id !== idToDelete);
    saveEntries(entries);
    renderOverview();
    renderDashboard();
  }
});

document.querySelectorAll('.period-tab').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.period-tab').forEach((b) => b.removeAttribute('aria-current'));
    button.setAttribute('aria-current', 'true');
    currentPeriod = button.getAttribute('data-period');
    renderOverview();
  });
});

// ---------------------------------------------------------------------------
// Invoerformulier — F1 (Create) en F5 (verplichte velden)
// ---------------------------------------------------------------------------
const form = document.getElementById('entry-form');
const formError = document.getElementById('form-error');
const valueUnitLabel = document.getElementById('value-unit-label');

function updateUnitLabel() {
  const checked = document.querySelector('input[name="valueType"]:checked');
  if (checked) valueUnitLabel.textContent = t(`unit.${checked.value}`);
}

document.querySelectorAll('input[name="valueType"]').forEach((radio) => {
  radio.addEventListener('change', updateUnitLabel);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = document.getElementById('input-date').value;
  const category = document.getElementById('input-category').value;
  const description = document.getElementById('input-description').value.trim();
  const checkedType = document.querySelector('input[name="valueType"]:checked');
  const valueType = checkedType ? checkedType.value : null;
  const value = Number(document.getElementById('input-value').value);

  const isValid = date && category && description && valueType && !Number.isNaN(value) && value >= 0;
  formError.hidden = isValid;
  if (!isValid) return;

  entries.push({
    id: `id-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    date,
    category,
    description,
    valueType,
    value,
    createdAt: Date.now(),
  });
  saveEntries(entries);

  form.reset();
  document.getElementById('input-date').value = todayISO();
  updateUnitLabel();

  showToast(t('form.savedToast'));
  renderDashboard();
  switchView('dashboard');
});

// ---------------------------------------------------------------------------
// Toast (kort bevestigingsbericht)
// ---------------------------------------------------------------------------
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

// ---------------------------------------------------------------------------
// Navigatie tussen de drie schermen
// ---------------------------------------------------------------------------
const views = document.querySelectorAll('.view');
const tabButtons = document.querySelectorAll('.tab-btn');

function switchView(target) {
  views.forEach((view) => { view.hidden = view.getAttribute('data-view') !== target; });
  tabButtons.forEach((button) => {
    if (button.getAttribute('data-target') === target) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });

  if (target === 'overview') renderOverview();
  if (target === 'dashboard') renderDashboard();
  if (target === 'add' && !document.getElementById('input-date').value) {
    document.getElementById('input-date').value = todayISO();
  }

  window.scrollTo(0, 0);
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => switchView(button.getAttribute('data-target')));
});

document.querySelectorAll('[data-quickadd]').forEach((button) => {
  button.addEventListener('click', () => {
    switchView('add');
    document.getElementById('input-category').value = button.getAttribute('data-quickadd');
  });
});

// ---------------------------------------------------------------------------
// Taalswitch — F11
// ---------------------------------------------------------------------------
document.getElementById('lang-toggle').addEventListener('click', async () => {
  await toggleLanguage();
  updateUnitLabel();
  renderDashboard();
  renderOverview();
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function init() {
  await initLanguage();

  document.getElementById('input-date').value = todayISO();
  updateUnitLabel();
  renderDashboard();
  renderOverview();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .catch((err) => console.warn('Service worker registratie mislukt:', err));
  }
}

document.addEventListener('DOMContentLoaded', init);
