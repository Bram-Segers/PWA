// ==========================================
// Mijn Gezondheid
// Gegevens opslaan in LocalStorage
// ==========================================

// Definieert de sleutel die gebruikt wordt voor het opslaan van items in LocalStorage.
// Uitleg: const STORAGE_KEY = "mijngezondheid:entries";
const STORAGE_KEY = "mijngezondheid:entries";

// Definieert de beschikbare categorieën die in de app gebruikt kunnen worden.
// Uitleg: const CATEGORIES = [
const CATEGORIES = [
    // Uitleg: "voeding",
    "voeding",
    // Uitleg: "beweging",
    "beweging",
    // Uitleg: "slaap",
    "slaap",
    // Uitleg: "overig"
    "overig"
// Uitleg: ];
];

// Haalt alle eerder opgeslagen items uit LocalStorage op.
// Uitleg: function loadEntries() {
function loadEntries() {

    // Pakt de opgeslagen data onder de vaste sleutel.
    // Uitleg: let gegevens = localStorage.getItem(STORAGE_KEY);
    let gegevens = localStorage.getItem(STORAGE_KEY);

    // Als er nog niets is opgeslagen, geef dan een lege lijst terug.
    // Uitleg: if (gegevens == null) {
    if (gegevens == null) {
        // Uitleg: return [];
        return [];
    // Uitleg: }
    }

    // Zet de opgeslagen JSON-string weer om naar een JavaScript-array.
    // Uitleg: return JSON.parse(gegevens);
    return JSON.parse(gegevens);
// Uitleg: }
}

// Slaat de huidige lijst met items weer op in LocalStorage.
// Uitleg: function saveEntries(lijst) {
function saveEntries(lijst) {
    // Zet de array om naar JSON en sla deze op onder de sleutel.
    // Uitleg: localStorage.setItem(STORAGE_KEY, JSON.stringify(lijst));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lijst));
// Uitleg: }
}

// Laadt de opgeslagen entries direct bij het starten van de app.
// Uitleg: let entries = loadEntries();
let entries = loadEntries();

// Houdt bij welke periode momenteel zichtbaar is in het overzicht.
// Uitleg: let currentPeriod = "dag";
let currentPeriod = "dag";


// ==========================================
// Datumfuncties
// ==========================================

// Zet een datumobject om naar een standaard formaat van jaar-maand-dag.
// Uitleg: function formatISO(datum) {
function formatISO(datum) {

    // Haalt het jaar uit het datumobject.
    // Uitleg: let jaar = datum.getFullYear();
    let jaar = datum.getFullYear();

    // Haalt de maand op en voegt een nul toe als het maar één cijfer is.
    // Uitleg: let maand = datum.getMonth() + 1;
    let maand = datum.getMonth() + 1;
    // Uitleg: if (maand < 10) {
    if (maand < 10) {
        // Uitleg: maand = "0" + maand;
        maand = "0" + maand;
    // Uitleg: }
    }

    // Haalt de dag op en voegt een nul toe als het maar één cijfer is.
    // Uitleg: let dag = datum.getDate();
    let dag = datum.getDate();
    // Uitleg: if (dag < 10) {
    if (dag < 10) {
        // Uitleg: dag = "0" + dag;
        dag = "0" + dag;
    // Uitleg: }
    }

    // Bouwt de datum terug samen in het juiste formaat.
    // Uitleg: return jaar + "-" + maand + "-" + dag;
    return jaar + "-" + maand + "-" + dag;
// Uitleg: }
}

// Geeft de datum van vandaag terug in het ISO-formaat.
// Uitleg: function todayISO() {
function todayISO() {
    // Maakt een nieuw datumobject voor vandaag.
    // Uitleg: let vandaag = new Date();
    let vandaag = new Date();
    // Zet die datum om naar een standaard string.
    // Uitleg: return formatISO(vandaag);
    return formatISO(vandaag);
// Uitleg: }
}

// Maakt een datum leesbaar voor de gebruiker op het scherm.
// Uitleg: function formatDisplayDate(iso) {
function formatDisplayDate(iso) {

    // Maak van de ISO-string weer een datumobject.
    // Uitleg: let datum = new Date(iso + "T00:00:00");
    let datum = new Date(iso + "T00:00:00");

    // Kies de taal voor de weergave op basis van de actieve taal.
    // Uitleg: let taal;
    let taal;

    // Uitleg: if (currentLang == "nl") {
    if (currentLang == "nl") {
        // Uitleg: taal = "nl-NL";
        taal = "nl-NL";
    // Uitleg: } else {
    } else {
        // Uitleg: taal = "en-GB";
        taal = "en-GB";
    // Uitleg: }
    }

    // Toon de dag en maand in een korte, duidelijke vorm.
    // Uitleg: return datum.toLocaleDateString(taal, {
    return datum.toLocaleDateString(taal, {
        // Uitleg: day: "numeric",
        day: "numeric",
        // Uitleg: month: "short"
        month: "short"
    // Uitleg: });
    });
// Uitleg: }
}


// ==========================================
// Filteren op dag, week of maand
// ==========================================

// Filtert de lijst op basis van de gekozen periode: dag, week of maand.
// Uitleg: function filterByPeriod(lijst, periode) {
function filterByPeriod(lijst, periode) {

    // Maakt een lege lijst voor de gefilterde resultaten.
    // Uitleg: let resultaat = [];
    let resultaat = [];

    // Maakt een datumobject voor vandaag en zet de tijd op nul.
    // Uitleg: let vandaag = new Date();
    let vandaag = new Date();
    // Uitleg: vandaag.setHours(0, 0, 0, 0);
    vandaag.setHours(0, 0, 0, 0);

    // Doorloopt alle items in de lijst.
    // Uitleg: for (let i = 0; i < lijst.length; i++) {
    for (let i = 0; i < lijst.length; i++) {

        // Haalt het huidige item op.
        // Uitleg: let item = lijst[i];
        let item = lijst[i];
        // Maakt van de item-datum een datumobject.
        // Uitleg: let datum = new Date(item.date + "T00:00:00");
        let datum = new Date(item.date + "T00:00:00");

        // Als de periode dag is, neem alleen items van vandaag op.
        // Uitleg: if (periode == "dag") {
        if (periode == "dag") {

            // Uitleg: if (formatISO(datum) == formatISO(vandaag)) {
            if (formatISO(datum) == formatISO(vandaag)) {
                // Uitleg: resultaat.push(item);
                resultaat.push(item);
            // Uitleg: }
            }

        // Uitleg: }
        }

        // Als de periode week is, neem alleen items uit de afgelopen 7 dagen op.
        // Uitleg: else if (periode == "week") {
        else if (periode == "week") {

            // Berekent het verschil in milliseconden tussen vandaag en de datum.
            // Uitleg: let verschil = vandaag - datum;
            let verschil = vandaag - datum;
            // Zet het verschil om naar dagen.
            // Uitleg: let dagen = Math.floor(verschil / 86400000);
            let dagen = Math.floor(verschil / 86400000);

            // Uitleg: if (dagen >= 0 && dagen < 7) {
            if (dagen >= 0 && dagen < 7) {
                // Uitleg: resultaat.push(item);
                resultaat.push(item);
            // Uitleg: }
            }

        // Uitleg: }
        }

        // Als de periode maand is, neem alleen items uit dezelfde maand en hetzelfde jaar op.
        // Uitleg: else if (periode == "maand") {
        else if (periode == "maand") {

            // Uitleg: if (
            if (
                // Uitleg: datum.getFullYear() == vandaag.getFullYear() &&
                datum.getFullYear() == vandaag.getFullYear() &&
                // Uitleg: datum.getMonth() == vandaag.getMonth()
                datum.getMonth() == vandaag.getMonth()
            // Uitleg: ) {
            ) {
                // Uitleg: resultaat.push(item);
                resultaat.push(item);
            // Uitleg: }
            }

        // Uitleg: }
        }

        // Als er geen geldige periode is, voeg alles toe.
        // Uitleg: else {
        else {

            // Uitleg: resultaat.push(item);
            resultaat.push(item);

        // Uitleg: }
        }

    // Uitleg: }
    }

    // Geeft de gefilterde lijst terug.
    // Uitleg: return resultaat;
    return resultaat;

// Uitleg: }
}

// Geeft alleen de gegevens van vandaag terug.
// Uitleg: function getTodayEntries() {
function getTodayEntries() {
    // Uitleg: return filterByPeriod(entries, "dag");
    return filterByPeriod(entries, "dag");
// Uitleg: }
}



// ==========================================
// Dashboard
// Balkjes en statistieken
// ==========================================

// Tekent de balken op het dashboard voor de categorieën van vandaag.
// Uitleg: function renderTodayBars() {
function renderTodayBars() {

    // Haalt alle items van vandaag op.
    // Uitleg: let todayEntries = getTodayEntries();
    let todayEntries = getTodayEntries();

    // Bepaalt het totaal aantal items van vandaag.
    // Uitleg: let totaal = todayEntries.length;
    let totaal = todayEntries.length;

    // Haalt de container op waarin de balken getekend moeten worden.
    // Uitleg: let container = document.getElementById("category-bars");
    let container = document.getElementById("category-bars");

    // Als er geen items zijn, toon dan een melding.
    // Uitleg: if (totaal == 0) {
    if (totaal == 0) {

        // Uitleg: container.innerHTML =
        container.innerHTML =
            // Uitleg: '<p class="empty-hint">' +
            '<p class="empty-hint">' +
            // Uitleg: t("dashboard.emptyHint") +
            t("dashboard.emptyHint") +
            // Uitleg: "</p>";
            "</p>";

        // Uitleg: return;
        return;
    // Uitleg: }
    }

    // Start een teller per categorie op nul.
    // Uitleg: let counts = {
    let counts = {
        // Uitleg: voeding: 0,
        voeding: 0,
        // Uitleg: beweging: 0,
        beweging: 0,
        // Uitleg: slaap: 0,
        slaap: 0,
        // Uitleg: overig: 0
        overig: 0
    // Uitleg: };
    };

    // Tel voor elke categorie hoeveel items er zijn.
    // Uitleg: for (let i = 0; i < todayEntries.length; i++) {
    for (let i = 0; i < todayEntries.length; i++) {

        // Uitleg: let categorie = todayEntries[i].category;
        let categorie = todayEntries[i].category;

        // Uitleg: counts[categorie] = counts[categorie] + 1;
        counts[categorie] = counts[categorie] + 1;
    // Uitleg: }
    }

    // Bouwt de HTML voor alle balken samen.
    // Uitleg: let html = "";
    let html = "";

    // Loopt door alle categorieën en maakt een balk per categorie.
    // Uitleg: for (let i = 0; i < CATEGORIES.length; i++) {
    for (let i = 0; i < CATEGORIES.length; i++) {

        // Uitleg: let categorie = CATEGORIES[i];
        let categorie = CATEGORIES[i];

        // Berekent het percentage van het totaal voor deze categorie.
        // Uitleg: let percentage = Math.round(
        let percentage = Math.round(
            // Uitleg: (counts[categorie] / totaal) * 100
            (counts[categorie] / totaal) * 100
        // Uitleg: );
        );

        // Voeg een balk toe aan de HTML-string.
        // Uitleg: html +=
        html +=
            // Uitleg: '<div class="bar-row">' +
            '<div class="bar-row">' +

            // Uitleg: '<span class="bar-label">' +
            '<span class="bar-label">' +
            // Uitleg: '<span class="dot" style="background:var(--color-' + categorie + ')"></span>' +
            '<span class="dot" style="background:var(--color-' + categorie + ')"></span>' +
            // Uitleg: t("category." + categorie) +
            t("category." + categorie) +
            // Uitleg: "</span>" +
            "</span>" +

            // Uitleg: '<div class="bar-track">' +
            '<div class="bar-track">' +
            // Uitleg: '<div class="bar-fill" style="width:' + percentage + '%; background:var(--color-' + categorie + ')"></div>' +
            '<div class="bar-fill" style="width:' + percentage + '%; background:var(--color-' + categorie + ')"></div>' +
            // Uitleg: "</div>" +
            "</div>" +

            // Uitleg: '<span class="bar-count">' +
            '<span class="bar-count">' +
            // Uitleg: counts[categorie] +
            counts[categorie] +
            // Uitleg: "</span>" +
            "</span>" +

            // Uitleg: "</div>";
            "</div>";
    // Uitleg: }
    }

    // Plaats de opgebouwde HTML in de container.
    // Uitleg: container.innerHTML = html;
    container.innerHTML = html;
// Uitleg: }
}
// ==========================================
// Statistieken van vandaag
// ==========================================

// Berekent de samenvatting van de gegevens van vandaag.
// Uitleg: function renderStats() {
function renderStats() {

    // Haalt de items van vandaag op.
    // Uitleg: let todayEntries = getTodayEntries();
    let todayEntries = getTodayEntries();

    // Initialiseert de variabelen voor de statistieken.
    // Uitleg: let kcal = 0;
    let kcal = 0;
    // Uitleg: let beweging = 0;
    let beweging = 0;
    // Uitleg: let slaap = 0;
    let slaap = 0;

    // Loopt door alle items van vandaag en telt de waarden bij elkaar op.
    // Uitleg: for (let i = 0; i < todayEntries.length; i++) {
    for (let i = 0; i < todayEntries.length; i++) {

        // Uitleg: let item = todayEntries[i];
        let item = todayEntries[i];

        // Tel calorieën op als het item van het type kcal is.
        // Uitleg: if (item.valueType == "kcal") {
        if (item.valueType == "kcal") {
            // Uitleg: kcal = kcal + Number(item.value);
            kcal = kcal + Number(item.value);
        // Uitleg: }
        }

        // Tel bewegingsminuten op als het item van de categorie beweging en type duur is.
        // Uitleg: if (item.category == "beweging" && item.valueType == "duur") {
        if (item.category == "beweging" && item.valueType == "duur") {
            // Uitleg: beweging = beweging + Number(item.value);
            beweging = beweging + Number(item.value);
        // Uitleg: }
        }

        // Tel slaapminuten op als het item van de categorie slaap en type duur is.
        // Uitleg: if (item.category == "slaap" && item.valueType == "duur") {
        if (item.category == "slaap" && item.valueType == "duur") {
            // Uitleg: slaap = slaap + Number(item.value);
            slaap = slaap + Number(item.value);
        // Uitleg: }
        }
    // Uitleg: }
    }

    // Vul de berekende waarden in op de dashboard-elementen.
    // Uitleg: document.getElementById("stat-kcal").textContent = kcal;
    document.getElementById("stat-kcal").textContent = kcal;
    // Uitleg: document.getElementById("stat-beweging").textContent = beweging;
    document.getElementById("stat-beweging").textContent = beweging;

    // Laat slaap zien in uren, tenzij er niets is ingevuld.
    // Uitleg: if (slaap > 0) {
    if (slaap > 0) {
        // Uitleg: document.getElementById("stat-slaap").textContent =
        document.getElementById("stat-slaap").textContent =
            // Uitleg: (slaap / 60).toFixed(1);
            (slaap / 60).toFixed(1);
    // Uitleg: } else {
    } else {
        // Uitleg: document.getElementById("stat-slaap").textContent = 0;
        document.getElementById("stat-slaap").textContent = 0;
    // Uitleg: }
    }

    // Toon hoeveel items er vandaag zijn toegevoegd.
    // Uitleg: document.getElementById("stat-aantal").textContent =
    document.getElementById("stat-aantal").textContent =
        // Uitleg: todayEntries.length;
        todayEntries.length;
// Uitleg: }
}


// Tekent het dashboard opnieuw met balken en statistieken.
// Uitleg: function renderDashboard() {
function renderDashboard() {
    // Uitleg: renderTodayBars();
    renderTodayBars();
    // Uitleg: renderStats();
    renderStats();
// Uitleg: }
}


// ==========================================
// Overzicht maken
// ==========================================

// Maakt het overzicht voor de gekozen periode.
// Uitleg: function renderOverview() {
function renderOverview() {

    // Filtert de entries op basis van de huidige periode.
    // Uitleg: let filtered = filterByPeriod(entries, currentPeriod);
    let filtered = filterByPeriod(entries, currentPeriod);

    // Sorteert de lijst zodat de nieuwste items eerst staan.
    // Uitleg: filtered.sort(function (a, b) {
    filtered.sort(function (a, b) {

        // Uitleg: if (a.date != b.date) {
        if (a.date != b.date) {

            // Uitleg: if (a.date < b.date) {
            if (a.date < b.date) {
                // Uitleg: return 1;
                return 1;
            // Uitleg: } else {
            } else {
                // Uitleg: return -1;
                return -1;
            // Uitleg: }
            }

        // Uitleg: }
        }

        // Uitleg: return b.createdAt - a.createdAt;
        return b.createdAt - a.createdAt;

    // Uitleg: });
    });

    // Initialiseert de totalen voor kcal en duur.
    // Uitleg: let totaalKcal = 0;
    let totaalKcal = 0;
    // Uitleg: let totaalDuur = 0;
    let totaalDuur = 0;

    // Tel alle relevante waarden bij elkaar op voor het overzicht.
    // Uitleg: for (let i = 0; i < filtered.length; i++) {
    for (let i = 0; i < filtered.length; i++) {

        // Uitleg: if (filtered[i].valueType == "kcal") {
        if (filtered[i].valueType == "kcal") {
            // Uitleg: totaalKcal += Number(filtered[i].value);
            totaalKcal += Number(filtered[i].value);
        // Uitleg: }
        }

        // Uitleg: if (filtered[i].valueType == "duur") {
        if (filtered[i].valueType == "duur") {
            // Uitleg: totaalDuur += Number(filtered[i].value);
            totaalDuur += Number(filtered[i].value);
        // Uitleg: }
        }
    // Uitleg: }
    }

    // Vul de totale waarden in het overzicht in.
    // Uitleg: document.getElementById("summary-kcal").textContent =
    document.getElementById("summary-kcal").textContent =
        // Uitleg: totaalKcal;
        totaalKcal;

    // Uitleg: document.getElementById("summary-duur").textContent =
    document.getElementById("summary-duur").textContent =
        // Uitleg: totaalDuur;
        totaalDuur;

    // Uitleg: document.getElementById("summary-aantal").textContent =
    document.getElementById("summary-aantal").textContent =
        // Uitleg: filtered.length;
        filtered.length;

    // Haalt de lijstcontainer op waar de items getoond worden.
    // Uitleg: let lijst = document.getElementById("entry-list");
    let lijst = document.getElementById("entry-list");

    // Als er geen gegevens zijn voor deze periode, toon dan een lege status.
    // Uitleg: if (filtered.length == 0) {
    if (filtered.length == 0) {

        // Uitleg: lijst.innerHTML =
        lijst.innerHTML =
            // Uitleg: '<div class="empty-state">' +
            '<div class="empty-state">' +
            // Uitleg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
            // Uitleg: '<circle cx="12" cy="12" r="9"/>' +
            '<circle cx="12" cy="12" r="9"/>' +
            // Uitleg: '<path d="M9 12h6M12 9v6" stroke-linecap="round"/>' +
            '<path d="M9 12h6M12 9v6" stroke-linecap="round"/>' +
            // Uitleg: '</svg>' +
            '</svg>' +

            // Uitleg: "<p><strong>" +
            "<p><strong>" +
            // Uitleg: t("overview.emptyTitle") +
            t("overview.emptyTitle") +
            // Uitleg: "</strong></p>" +
            "</strong></p>" +

            // Uitleg: "<p>" +
            "<p>" +
            // Uitleg: t("overview.emptyHint") +
            t("overview.emptyHint") +
            // Uitleg: "</p>" +
            "</p>" +

            // Uitleg: "</div>";
            "</div>";

        // Uitleg: return;
        return;
    // Uitleg: }
    }

    // Bouwt de HTML voor alle items in het overzicht.
    // Uitleg: let html = "";
    let html = "";

    // Uitleg: for (let i = 0; i < filtered.length; i++) {
    for (let i = 0; i < filtered.length; i++) {

        // Uitleg: let item = filtered[i];
        let item = filtered[i];

        // Haalt de juiste eenheid voor de waarde op uit de vertalingen.
        // Uitleg: let eenheid = t("unit." + item.valueType);
        let eenheid = t("unit." + item.valueType);

        // Maakt extra datumtekst voor periodes die niet dag zijn.
        // Uitleg: let datumTekst = "";
        let datumTekst = "";

        // Uitleg: if (currentPeriod != "dag") {
        if (currentPeriod != "dag") {
            // Uitleg: datumTekst = " · " + formatDisplayDate(item.date);
            datumTekst = " · " + formatDisplayDate(item.date);
        // Uitleg: }
        }

        // Uitleg: html +=
        html +=

            // Uitleg: '<div class="entry-card">' +
            '<div class="entry-card">' +

            // Uitleg: '<span class="dot" style="background:var(--color-' +
            '<span class="dot" style="background:var(--color-' +
            // Uitleg: item.category +
            item.category +
            // Uitleg: ')"></span>' +
            ')"></span>' +

            // Uitleg: '<div class="entry-main">' +
            '<div class="entry-main">' +

            // Uitleg: '<div class="entry-desc">' +
            '<div class="entry-desc">' +
            // Uitleg: item.description +
            item.description +
            // Uitleg: '</div>' +
            '</div>' +

            // Uitleg: '<div class="entry-meta">' +
            '<div class="entry-meta">' +
            // Uitleg: t("category." + item.category) +
            t("category." + item.category) +
            // Uitleg: datumTekst +
            datumTekst +
            // Uitleg: '</div>' +
            '</div>' +

            // Uitleg: '</div>' +
            '</div>' +

            // Uitleg: '<div class="entry-value">' +
            '<div class="entry-value">' +
            // Uitleg: item.value +
            item.value +
            // Uitleg: " " +
            " " +
            // Uitleg: eenheid +
            eenheid +
            // Uitleg: '</div>' +
            '</div>' +

            // Uitleg: '<button class="entry-delete" data-delete-id="' +
            '<button class="entry-delete" data-delete-id="' +
            // Uitleg: item.id +
            item.id +
            // Uitleg: '" aria-label="' +
            '" aria-label="' +
            // Uitleg: t("overview.deleteLabel") +
            t("overview.deleteLabel") +
            // Uitleg: '">' +
            '">' +

            // Uitleg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            // Uitleg: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/>' +
            '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/>' +
            // Uitleg: '</svg>' +
            '</svg>' +

            // Uitleg: '</button>' +
            '</button>' +

            // Uitleg: '</div>';
            '</div>';

    // Uitleg: }
    }

    // Plaats de opgebouwde HTML in de lijstcontainer.
    // Uitleg: lijst.innerHTML = html;
    lijst.innerHTML = html;

// Uitleg: }
}


// ==========================================
// Item verwijderen
// ==========================================

// Luistert naar clicks op de verwijderknoppen in het overzicht.
// Uitleg: document.getElementById("entry-list").addEventListener("click", function (event) {
document.getElementById("entry-list").addEventListener("click", function (event) {

    // Zoekt naar de dichtstbijzijnde verwijderknop in het click-target.
    // Uitleg: let knop = event.target.closest("[data-delete-id]");
    let knop = event.target.closest("[data-delete-id]");

    // Als er geen knop is aangeklikt, stop dan.
    // Uitleg: if (knop == null) {
    if (knop == null) {
        // Uitleg: return;
        return;
    // Uitleg: }
    }

    // Haalt de id van het item uit het data-attribuut van de knop.
    // Uitleg: let id = knop.getAttribute("data-delete-id");
    let id = knop.getAttribute("data-delete-id");

    // Vraagt de gebruiker om bevestiging voordat iets wordt verwijderd.
    // Uitleg: let antwoord = window.confirm(
    let antwoord = window.confirm(
        // Uitleg: t("overview.deleteConfirm")
        t("overview.deleteConfirm")
    // Uitleg: );
    );

    // Uitleg: if (antwoord) {
    if (antwoord) {

        // Maakt een nieuwe lijst zonder het te verwijderen item.
        // Uitleg: let nieuweLijst = [];
        let nieuweLijst = [];

        // Uitleg: for (let i = 0; i < entries.length; i++) {
        for (let i = 0; i < entries.length; i++) {

            // Uitleg: if (entries[i].id != id) {
            if (entries[i].id != id) {
                // Uitleg: nieuweLijst.push(entries[i]);
                nieuweLijst.push(entries[i]);
            // Uitleg: }
            }

        // Uitleg: }
        }

        // Vervangt de oude lijst door de nieuwe lijst zonder het verwijderde item.
        // Uitleg: entries = nieuweLijst;
        entries = nieuweLijst;

        // Slaat de aangepaste lijst op.
        // Uitleg: saveEntries(entries);
        saveEntries(entries);

        // Werk het overzicht en dashboard opnieuw bij.
        // Uitleg: renderOverview();
        renderOverview();
        // Uitleg: renderDashboard();
        renderDashboard();

    // Uitleg: }
    }

// Uitleg: });
});


// ==========================================
// Wisselen tussen dag, week en maand
// ==========================================

// Haalt alle periodeknoppen op uit de DOM.
// Uitleg: let tabs = document.querySelectorAll(".period-tab");
let tabs = document.querySelectorAll(".period-tab");

// Voeg een kliklistener toe aan elke periodeknop.
// Uitleg: for (let i = 0; i < tabs.length; i++) {
for (let i = 0; i < tabs.length; i++) {

    // Uitleg: tabs[i].addEventListener("click", function () {
    tabs[i].addEventListener("click", function () {

        // Haalt alle tab-markeringen op.
        // Uitleg: let alleTabs = document.querySelectorAll(".period-tab");
        let alleTabs = document.querySelectorAll(".period-tab");

        // Verwijdert de actieve markering van alle tabs.
        // Uitleg: for (let j = 0; j < alleTabs.length; j++) {
        for (let j = 0; j < alleTabs.length; j++) {
            // Uitleg: alleTabs[j].removeAttribute("aria-current");
            alleTabs[j].removeAttribute("aria-current");
        // Uitleg: }
        }

        // Markeer de gekozen tab als actief.
        // Uitleg: this.setAttribute("aria-current", "true");
        this.setAttribute("aria-current", "true");

        // Zet de huidige periode op basis van de knop.
        // Uitleg: currentPeriod = this.getAttribute("data-period");
        currentPeriod = this.getAttribute("data-period");

        // Render het overzicht opnieuw voor de nieuwe periode.
        // Uitleg: renderOverview();
        renderOverview();

    // Uitleg: });
    });

// Uitleg: }
}
// ==========================================
// Invoerformulier
// ==========================================

// Haalt het formulier, de foutmelding en het label voor de eenheid op.
// Uitleg: let form = document.getElementById("entry-form");
let form = document.getElementById("entry-form");
// Uitleg: let formError = document.getElementById("form-error");
let formError = document.getElementById("form-error");
// Uitleg: let valueUnitLabel = document.getElementById("value-unit-label");
let valueUnitLabel = document.getElementById("value-unit-label");

// Past de tekst achter het invoerveld aan op basis van de gekozen waarde-type.
// Uitleg: function updateUnitLabel() {
function updateUnitLabel() {

    // Haalt het geselecteerde radio-veld op.
    // Uitleg: let gekozen = document.querySelector(
    let gekozen = document.querySelector(
        // Uitleg: 'input[name="valueType"]:checked'
        'input[name="valueType"]:checked'
    // Uitleg: );
    );

    // Als er een selectie is, toon dan de juiste eenheid.
    // Uitleg: if (gekozen != null) {
    if (gekozen != null) {
        // Uitleg: valueUnitLabel.textContent =
        valueUnitLabel.textContent =
            // Uitleg: t("unit." + gekozen.value);
            t("unit." + gekozen.value);
    // Uitleg: }
    }

// Uitleg: }
}

// Luistert naar veranderingen in de radio-buttons voor waarde-type.
// Uitleg: let radios = document.querySelectorAll(
let radios = document.querySelectorAll(
    // Uitleg: 'input[name="valueType"]'
    'input[name="valueType"]'
// Uitleg: );
);

// Uitleg: for (let i = 0; i < radios.length; i++) {
for (let i = 0; i < radios.length; i++) {

    // Uitleg: radios[i].addEventListener("change", updateUnitLabel);
    radios[i].addEventListener("change", updateUnitLabel);

// Uitleg: }
}


// Verwerkt het versturen van het invoerformulier.
// Uitleg: form.addEventListener("submit", function (event) {
form.addEventListener("submit", function (event) {

    // Voorkomt dat de pagina opnieuw wordt geladen.
    // Uitleg: event.preventDefault();
    event.preventDefault();

    // Haalt de ingevulde waarden uit het formulier op.
    // Uitleg: let date =
    let date =
        // Uitleg: document.getElementById("input-date").value;
        document.getElementById("input-date").value;

    // Uitleg: let category =
    let category =
        // Uitleg: document.getElementById("input-category").value;
        document.getElementById("input-category").value;

    // Uitleg: let description =
    let description =
        // Uitleg: document.getElementById("input-description").value.trim();
        document.getElementById("input-description").value.trim();

    // Uitleg: let gekozen =
    let gekozen =
        // Uitleg: document.querySelector(
        document.querySelector(
            // Uitleg: 'input[name="valueType"]:checked'
            'input[name="valueType"]:checked'
        // Uitleg: );
        );

    // Uitleg: let valueType = null;
    let valueType = null;

    // Uitleg: if (gekozen != null) {
    if (gekozen != null) {
        // Uitleg: valueType = gekozen.value;
        valueType = gekozen.value;
    // Uitleg: }
    }

    // Zet de ingevoerde waarde om naar een getal.
    // Uitleg: let value = Number(
    let value = Number(
        // Uitleg: document.getElementById("input-value").value
        document.getElementById("input-value").value
    // Uitleg: );
    );

    // Standaard is het formulier geldig.
    // Uitleg: let geldig = true;
    let geldig = true;

    // Uitleg: if (
    if (
        // Uitleg: date == "" ||
        date == "" ||
        // Uitleg: category == "" ||
        category == "" ||
        // Uitleg: description == "" ||
        description == "" ||
        // Uitleg: valueType == null ||
        valueType == null ||
        // Uitleg: isNaN(value) ||
        isNaN(value) ||
        // Uitleg: value < 0
        value < 0
    // Uitleg: ) {
    ) {
        // Uitleg: geldig = false;
        geldig = false;
    // Uitleg: }
    }

    // Toont of verbergt de foutmelding afhankelijk van de geldigheid.
    // Uitleg: formError.hidden = geldig;
    formError.hidden = geldig;

    // Stop als het formulier niet geldig is.
    // Uitleg: if (!geldig) {
    if (!geldig) {
        // Uitleg: return;
        return;
    // Uitleg: }
    }

    // Maakt een nieuw itemobject met de ingevoerde gegevens.
    // Uitleg: let nieuwItem = {
    let nieuwItem = {

        // Uitleg: id:
        id:
            // Uitleg: "id-" +
            "id-" +
            // Uitleg: Date.now() +
            Date.now() +
            // Uitleg: "-" +
            "-" +
            // Uitleg: Math.floor(Math.random() * 100000),
            Math.floor(Math.random() * 100000),

        // Uitleg: date: date,
        date: date,
        // Uitleg: category: category,
        category: category,
        // Uitleg: description: description,
        description: description,
        // Uitleg: valueType: valueType,
        valueType: valueType,
        // Uitleg: value: value,
        value: value,
        // Uitleg: createdAt: Date.now()
        createdAt: Date.now()

    // Uitleg: };
    };

    // Voegt het nieuwe item toe aan de lijst.
    // Uitleg: entries.push(nieuwItem);
    entries.push(nieuwItem);

    // Slaat de bijgewerkte lijst opnieuw op.
    // Uitleg: saveEntries(entries);
    saveEntries(entries);

    // Reset het formulier na opslaan.
    // Uitleg: form.reset();
    form.reset();

    // Uitleg: document.getElementById("input-date").value =
    document.getElementById("input-date").value =
        // Uitleg: todayISO();
        todayISO();

    // Past de eenheid weer aan voor het standaardtype.
    // Uitleg: updateUnitLabel();
    updateUnitLabel();

    // Toont een bevestigingsmelding.
    // Uitleg: showToast(t("form.savedToast"));
    showToast(t("form.savedToast"));

    // Werk het dashboard bij en ga terug naar het dashboard.
    // Uitleg: renderDashboard();
    renderDashboard();

    // Uitleg: switchView("dashboard");
    switchView("dashboard");

// Uitleg: });
});


// ==========================================
// Toastmelding
// ==========================================

// Houdt de timer bij voor de toastmelding.
// Uitleg: let toastTimer;
let toastTimer;

// Toont een korte melding op het scherm.
// Uitleg: function showToast(message) {
function showToast(message) {

    // Haalt het toast-element uit de DOM.
    // Uitleg: let toast =
    let toast =
        // Uitleg: document.getElementById("toast");
        document.getElementById("toast");

    // Zet de tekst van de melding.
    // Uitleg: toast.textContent = message;
    toast.textContent = message;

    // Maakt de melding zichtbaar.
    // Uitleg: toast.classList.add("visible");
    toast.classList.add("visible");

    // Stopt een eerdere timer zodat de melding niet te snel verdwijnt.
    // Uitleg: clearTimeout(toastTimer);
    clearTimeout(toastTimer);

    // Verbergt de melding na 2,2 seconden.
    // Uitleg: toastTimer = setTimeout(function () {
    toastTimer = setTimeout(function () {

        // Uitleg: toast.classList.remove("visible");
        toast.classList.remove("visible");

    // Uitleg: }, 2200);
    }, 2200);

// Uitleg: }
}


// ==========================================
// Wisselen tussen schermen
// ==========================================

// Haalt alle views en tabknoppen uit de DOM.
// Uitleg: let views =
let views =
    // Uitleg: document.querySelectorAll(".view");
    document.querySelectorAll(".view");

// Uitleg: let tabButtons =
let tabButtons =
    // Uitleg: document.querySelectorAll(".tab-btn");
    document.querySelectorAll(".tab-btn");

// Wisselt tussen de verschillende schermen van de app.
// Uitleg: function switchView(doel) {
function switchView(doel) {

    // Toon alleen de gekozen view en verberg de anderen.
    // Uitleg: for (let i = 0; i < views.length; i++) {
    for (let i = 0; i < views.length; i++) {

        // Uitleg: let view = views[i];
        let view = views[i];

        // Uitleg: if (view.getAttribute("data-view") == doel) {
        if (view.getAttribute("data-view") == doel) {
            // Uitleg: view.hidden = false;
            view.hidden = false;
        // Uitleg: } else {
        } else {
            // Uitleg: view.hidden = true;
            view.hidden = true;
        // Uitleg: }
        }

    // Uitleg: }
    }

    // Markeer de juiste tabknop als actief.
    // Uitleg: for (let i = 0; i < tabButtons.length; i++) {
    for (let i = 0; i < tabButtons.length; i++) {

        // Uitleg: if (
        if (
            // Uitleg: tabButtons[i].getAttribute("data-target") == doel
            tabButtons[i].getAttribute("data-target") == doel
        // Uitleg: ) {
        ) {

            // Uitleg: tabButtons[i].setAttribute(
            tabButtons[i].setAttribute(
                // Uitleg: "aria-current",
                "aria-current",
                // Uitleg: "true"
                "true"
            // Uitleg: );
            );

        // Uitleg: } else {
        } else {

            // Uitleg: tabButtons[i].removeAttribute(
            tabButtons[i].removeAttribute(
                // Uitleg: "aria-current"
                "aria-current"
            // Uitleg: );
            );

        // Uitleg: }
        }

    // Uitleg: }
    }

    // Werk het overzicht bij als dat scherm wordt geopend.
    // Uitleg: if (doel == "overview") {
    if (doel == "overview") {
        // Uitleg: renderOverview();
        renderOverview();
    // Uitleg: }
    }

    // Werk het dashboard bij als dat scherm wordt geopend.
    // Uitleg: if (doel == "dashboard") {
    if (doel == "dashboard") {
        // Uitleg: renderDashboard();
        renderDashboard();
    // Uitleg: }
    }

    // Als het invoerscherm wordt geopend, zet de datum op vandaag als die leeg is.
    // Uitleg: if (doel == "add") {
    if (doel == "add") {

        // Uitleg: let datum =
        let datum =
            // Uitleg: document.getElementById("input-date");
            document.getElementById("input-date");

        // Uitleg: if (datum.value == "") {
        if (datum.value == "") {
            // Uitleg: datum.value = todayISO();
            datum.value = todayISO();
        // Uitleg: }
        }

    // Uitleg: }
    }

    // Scroll terug naar boven bij schermwissel.
    // Uitleg: window.scrollTo(0, 0);
    window.scrollTo(0, 0);

// Uitleg: }
}


// Knoppen onderaan
// Voeg een clicklistener toe aan elke tabknop onderaan.
// Uitleg: for (let i = 0; i < tabButtons.length; i++) {
for (let i = 0; i < tabButtons.length; i++) {

    // Uitleg: tabButtons[i].addEventListener("click", function () {
    tabButtons[i].addEventListener("click", function () {

        // Uitleg: let doel =
        let doel =
            // Uitleg: this.getAttribute("data-target");
            this.getAttribute("data-target");

        // Uitleg: switchView(doel);
        switchView(doel);

    // Uitleg: });
    });

// Uitleg: }
}


// Haalt alle snelle categorie-knoppen op.
// Uitleg: let quickButtons =
let quickButtons =
    // Uitleg: document.querySelectorAll("[data-quickadd]");
    document.querySelectorAll("[data-quickadd]");

// Voeg een clicklistener toe aan de snelle categorie-knoppen.
// Uitleg: for (let i = 0; i < quickButtons.length; i++) {
for (let i = 0; i < quickButtons.length; i++) {

    // Uitleg: quickButtons[i].addEventListener("click", function () {
    quickButtons[i].addEventListener("click", function () {

        // Uitleg: switchView("add");
        switchView("add");

        // Uitleg: document.getElementById("input-category").value =
        document.getElementById("input-category").value =
            // Uitleg: this.getAttribute("data-quickadd");
            this.getAttribute("data-quickadd");

    // Uitleg: });
    });

// Uitleg: }
}


// ==========================================
// Taal veranderen
// ==========================================

// Luistert naar klikken op de taalwisselknop.
// Uitleg: document.getElementById("lang-toggle")
document.getElementById("lang-toggle")
// Uitleg: .addEventListener("click", async function () {
.addEventListener("click", async function () {

    // Uitleg: await toggleLanguage();
    await toggleLanguage();

    // Uitleg: updateUnitLabel();
    updateUnitLabel();

    // Uitleg: renderDashboard();
    renderDashboard();

    // Uitleg: renderOverview();
    renderOverview();

// Uitleg: });
});


// ==========================================
// App starten
// ==========================================

// Start de app wanneer de pagina geladen is.
// Uitleg: async function init() {
async function init() {

    // Laadt eerst de taalinstellingen.
    // Uitleg: await initLanguage();
    await initLanguage();

    // Stelt de standaard datum in op vandaag.
    // Uitleg: document.getElementById("input-date").value =
    document.getElementById("input-date").value =
        // Uitleg: todayISO();
        todayISO();

    // Past de eenheid van het waardeveld aan.
    // Uitleg: updateUnitLabel();
    updateUnitLabel();

    // Tekent dashboard en overzicht voor de eerste keer.
    // Uitleg: renderDashboard();
    renderDashboard();

    // Uitleg: renderOverview();
    renderOverview();

    // Registreert de service worker als de browser dit ondersteunt.
    // Uitleg: if ("serviceWorker" in navigator) {
    if ("serviceWorker" in navigator) {

        // Uitleg: navigator.serviceWorker
        navigator.serviceWorker
            // Uitleg: .register("./service-worker.js")
            .register("./service-worker.js")
            // Uitleg: .catch(function (fout) {
            .catch(function (fout) {

                // Uitleg: console.log(
                console.log(
                    // Uitleg: "Service worker niet geladen:",
                    "Service worker niet geladen:",
                    // Uitleg: fout
                    fout
                // Uitleg: );
                );

            // Uitleg: });
            });

    // Uitleg: }
    }

// Uitleg: }
}

// Start de app zodra de DOM klaar is.
// Uitleg: document.addEventListener(
document.addEventListener(
    // Uitleg: "DOMContentLoaded",
    "DOMContentLoaded",
    // Uitleg: init
    init
// Uitleg: );
);