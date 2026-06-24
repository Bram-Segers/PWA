// ==========================================
// Mijn Gezondheid
// Gegevens opslaan in LocalStorage
// ==========================================

const STORAGE_KEY = "mijngezondheid:entries";

const CATEGORIES = [
    "voeding",
    "beweging",
    "slaap",
    "overig"
];

// Gegevens ophalen uit LocalStorage
function loadEntries() {

    let gegevens = localStorage.getItem(STORAGE_KEY);

    if (gegevens == null) {
        return [];
    }

    return JSON.parse(gegevens);
}

// Gegevens opslaan
function saveEntries(lijst) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lijst));
}

// Lijst met alle ingevoerde gegevens
let entries = loadEntries();

// Huidige overzicht (dag, week of maand)
let currentPeriod = "dag";


// ==========================================
// Datumfuncties
// ==========================================

// Datum omzetten naar yyyy-mm-dd
function formatISO(datum) {

    let jaar = datum.getFullYear();

    let maand = datum.getMonth() + 1;
    if (maand < 10) {
        maand = "0" + maand;
    }

    let dag = datum.getDate();
    if (dag < 10) {
        dag = "0" + dag;
    }

    return jaar + "-" + maand + "-" + dag;
}

// Geeft de datum van vandaag terug
function todayISO() {
    let vandaag = new Date();
    return formatISO(vandaag);
}

// Mooie datum voor op het scherm
function formatDisplayDate(iso) {

    let datum = new Date(iso + "T00:00:00");

    let taal;

    if (currentLang == "nl") {
        taal = "nl-NL";
    } else {
        taal = "en-GB";
    }

    return datum.toLocaleDateString(taal, {
        day: "numeric",
        month: "short"
    });
}


// ==========================================
// Filteren op dag, week of maand
// ==========================================

function filterByPeriod(lijst, periode) {

    let resultaat = [];

    let vandaag = new Date();
    vandaag.setHours(0, 0, 0, 0);

    for (let i = 0; i < lijst.length; i++) {

        let item = lijst[i];
        let datum = new Date(item.date + "T00:00:00");

        if (periode == "dag") {

            if (formatISO(datum) == formatISO(vandaag)) {
                resultaat.push(item);
            }

        }

        else if (periode == "week") {

            let verschil = vandaag - datum;
            let dagen = Math.floor(verschil / 86400000);

            if (dagen >= 0 && dagen < 7) {
                resultaat.push(item);
            }

        }

        else if (periode == "maand") {

            if (
                datum.getFullYear() == vandaag.getFullYear() &&
                datum.getMonth() == vandaag.getMonth()
            ) {
                resultaat.push(item);
            }

        }

        else {

            resultaat.push(item);

        }

    }

    return resultaat;

}

// Geeft alleen de gegevens van vandaag terug
function getTodayEntries() {
    return filterByPeriod(entries, "dag");
}



// ==========================================
// Dashboard
// Balkjes en statistieken
// ==========================================

function renderTodayBars() {

    let todayEntries = getTodayEntries();

    let totaal = todayEntries.length;

    let container = document.getElementById("category-bars");

    if (totaal == 0) {

        container.innerHTML =
            '<p class="empty-hint">' +
            t("dashboard.emptyHint") +
            "</p>";

        return;
    }

    // Aantal per categorie tellen
    let counts = {
        voeding: 0,
        beweging: 0,
        slaap: 0,
        overig: 0
    };

    for (let i = 0; i < todayEntries.length; i++) {

        let categorie = todayEntries[i].category;

        counts[categorie] = counts[categorie] + 1;
    }

    let html = "";

    for (let i = 0; i < CATEGORIES.length; i++) {

        let categorie = CATEGORIES[i];

        let percentage = Math.round(
            (counts[categorie] / totaal) * 100
        );

        html +=
            '<div class="bar-row">' +

            '<span class="bar-label">' +
            '<span class="dot" style="background:var(--color-' + categorie + ')"></span>' +
            t("category." + categorie) +
            "</span>" +

            '<div class="bar-track">' +
            '<div class="bar-fill" style="width:' + percentage + '%; background:var(--color-' + categorie + ')"></div>' +
            "</div>" +

            '<span class="bar-count">' +
            counts[categorie] +
            "</span>" +

            "</div>";
    }

    container.innerHTML = html;
}
// ==========================================
// Statistieken van vandaag
// ==========================================

function renderStats() {

    let todayEntries = getTodayEntries();

    let kcal = 0;
    let beweging = 0;
    let slaap = 0;

    // Alles optellen
    for (let i = 0; i < todayEntries.length; i++) {

        let item = todayEntries[i];

        if (item.valueType == "kcal") {
            kcal = kcal + Number(item.value);
        }

        if (item.category == "beweging" && item.valueType == "duur") {
            beweging = beweging + Number(item.value);
        }

        if (item.category == "slaap" && item.valueType == "duur") {
            slaap = slaap + Number(item.value);
        }
    }

    document.getElementById("stat-kcal").textContent = kcal;
    document.getElementById("stat-beweging").textContent = beweging;

    if (slaap > 0) {
        document.getElementById("stat-slaap").textContent =
            (slaap / 60).toFixed(1);
    } else {
        document.getElementById("stat-slaap").textContent = 0;
    }

    document.getElementById("stat-aantal").textContent =
        todayEntries.length;
}


// Dashboard opnieuw tekenen
function renderDashboard() {
    renderTodayBars();
    renderStats();
}


// ==========================================
// Overzicht maken
// ==========================================

function renderOverview() {

    let filtered = filterByPeriod(entries, currentPeriod);

    // Nieuwste eerst
    filtered.sort(function (a, b) {

        if (a.date != b.date) {

            if (a.date < b.date) {
                return 1;
            } else {
                return -1;
            }

        }

        return b.createdAt - a.createdAt;

    });

    let totaalKcal = 0;
    let totaalDuur = 0;

    for (let i = 0; i < filtered.length; i++) {

        if (filtered[i].valueType == "kcal") {
            totaalKcal += Number(filtered[i].value);
        }

        if (filtered[i].valueType == "duur") {
            totaalDuur += Number(filtered[i].value);
        }
    }

    document.getElementById("summary-kcal").textContent =
        totaalKcal;

    document.getElementById("summary-duur").textContent =
        totaalDuur;

    document.getElementById("summary-aantal").textContent =
        filtered.length;

    let lijst = document.getElementById("entry-list");

    // Geen gegevens gevonden
    if (filtered.length == 0) {

        lijst.innerHTML =
            '<div class="empty-state">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
            '<circle cx="12" cy="12" r="9"/>' +
            '<path d="M9 12h6M12 9v6" stroke-linecap="round"/>' +
            '</svg>' +

            "<p><strong>" +
            t("overview.emptyTitle") +
            "</strong></p>" +

            "<p>" +
            t("overview.emptyHint") +
            "</p>" +

            "</div>";

        return;
    }

    let html = "";

    for (let i = 0; i < filtered.length; i++) {

        let item = filtered[i];

        let eenheid = t("unit." + item.valueType);

        let datumTekst = "";

        if (currentPeriod != "dag") {
            datumTekst = " · " + formatDisplayDate(item.date);
        }

        html +=

            '<div class="entry-card">' +

            '<span class="dot" style="background:var(--color-' +
            item.category +
            ')"></span>' +

            '<div class="entry-main">' +

            '<div class="entry-desc">' +
            item.description +
            '</div>' +

            '<div class="entry-meta">' +
            t("category." + item.category) +
            datumTekst +
            '</div>' +

            '</div>' +

            '<div class="entry-value">' +
            item.value +
            " " +
            eenheid +
            '</div>' +

            '<button class="entry-delete" data-delete-id="' +
            item.id +
            '" aria-label="' +
            t("overview.deleteLabel") +
            '">' +

            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/>' +
            '</svg>' +

            '</button>' +

            '</div>';

    }

    lijst.innerHTML = html;

}


// ==========================================
// Item verwijderen
// ==========================================

document.getElementById("entry-list").addEventListener("click", function (event) {

    let knop = event.target.closest("[data-delete-id]");

    if (knop == null) {
        return;
    }

    let id = knop.getAttribute("data-delete-id");

    let antwoord = window.confirm(
        t("overview.deleteConfirm")
    );

    if (antwoord) {

        let nieuweLijst = [];

        for (let i = 0; i < entries.length; i++) {

            if (entries[i].id != id) {
                nieuweLijst.push(entries[i]);
            }

        }

        entries = nieuweLijst;

        saveEntries(entries);

        renderOverview();
        renderDashboard();

    }

});


// ==========================================
// Wisselen tussen dag, week en maand
// ==========================================

let tabs = document.querySelectorAll(".period-tab");

for (let i = 0; i < tabs.length; i++) {

    tabs[i].addEventListener("click", function () {

        let alleTabs = document.querySelectorAll(".period-tab");

        for (let j = 0; j < alleTabs.length; j++) {
            alleTabs[j].removeAttribute("aria-current");
        }

        this.setAttribute("aria-current", "true");

        currentPeriod = this.getAttribute("data-period");

        renderOverview();

    });

}
// ==========================================
// Invoerformulier
// ==========================================

let form = document.getElementById("entry-form");
let formError = document.getElementById("form-error");
let valueUnitLabel = document.getElementById("value-unit-label");

// Tekst achter het invoerveld aanpassen
function updateUnitLabel() {

    let gekozen = document.querySelector(
        'input[name="valueType"]:checked'
    );

    if (gekozen != null) {
        valueUnitLabel.textContent =
            t("unit." + gekozen.value);
    }

}

// Luisteren naar de radio buttons
let radios = document.querySelectorAll(
    'input[name="valueType"]'
);

for (let i = 0; i < radios.length; i++) {

    radios[i].addEventListener("change", updateUnitLabel);

}


// Formulier versturen
form.addEventListener("submit", function (event) {

    event.preventDefault();

    let date =
        document.getElementById("input-date").value;

    let category =
        document.getElementById("input-category").value;

    let description =
        document.getElementById("input-description").value.trim();

    let gekozen =
        document.querySelector(
            'input[name="valueType"]:checked'
        );

    let valueType = null;

    if (gekozen != null) {
        valueType = gekozen.value;
    }

    let value = Number(
        document.getElementById("input-value").value
    );

    let geldig = true;

    if (
        date == "" ||
        category == "" ||
        description == "" ||
        valueType == null ||
        isNaN(value) ||
        value < 0
    ) {
        geldig = false;
    }

    formError.hidden = geldig;

    if (!geldig) {
        return;
    }

    let nieuwItem = {

        id:
            "id-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 100000),

        date: date,
        category: category,
        description: description,
        valueType: valueType,
        value: value,
        createdAt: Date.now()

    };

    entries.push(nieuwItem);

    saveEntries(entries);

    form.reset();

    document.getElementById("input-date").value =
        todayISO();

    updateUnitLabel();

    showToast(t("form.savedToast"));

    renderDashboard();

    switchView("dashboard");

});


// ==========================================
// Toastmelding
// ==========================================

let toastTimer;

function showToast(message) {

    let toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {

        toast.classList.remove("visible");

    }, 2200);

}


// ==========================================
// Wisselen tussen schermen
// ==========================================

let views =
    document.querySelectorAll(".view");

let tabButtons =
    document.querySelectorAll(".tab-btn");

function switchView(doel) {

    for (let i = 0; i < views.length; i++) {

        let view = views[i];

        if (view.getAttribute("data-view") == doel) {
            view.hidden = false;
        } else {
            view.hidden = true;
        }

    }

    for (let i = 0; i < tabButtons.length; i++) {

        if (
            tabButtons[i].getAttribute("data-target") == doel
        ) {

            tabButtons[i].setAttribute(
                "aria-current",
                "true"
            );

        } else {

            tabButtons[i].removeAttribute(
                "aria-current"
            );

        }

    }

    if (doel == "overview") {
        renderOverview();
    }

    if (doel == "dashboard") {
        renderDashboard();
    }

    if (doel == "add") {

        let datum =
            document.getElementById("input-date");

        if (datum.value == "") {
            datum.value = todayISO();
        }

    }

    window.scrollTo(0, 0);

}


// Knoppen onderaan
for (let i = 0; i < tabButtons.length; i++) {

    tabButtons[i].addEventListener("click", function () {

        let doel =
            this.getAttribute("data-target");

        switchView(doel);

    });

}


// Snelle categorie kiezen
let quickButtons =
    document.querySelectorAll("[data-quickadd]");

for (let i = 0; i < quickButtons.length; i++) {

    quickButtons[i].addEventListener("click", function () {

        switchView("add");

        document.getElementById("input-category").value =
            this.getAttribute("data-quickadd");

    });

}


// ==========================================
// Taal veranderen
// ==========================================

document.getElementById("lang-toggle")
.addEventListener("click", async function () {

    await toggleLanguage();

    updateUnitLabel();

    renderDashboard();

    renderOverview();

});


// ==========================================
// App starten
// ==========================================

async function init() {

    await initLanguage();

    document.getElementById("input-date").value =
        todayISO();

    updateUnitLabel();

    renderDashboard();

    renderOverview();

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker
            .register("./service-worker.js")
            .catch(function (fout) {

                console.log(
                    "Service worker niet geladen:",
                    fout
                );

            });

    }

}

document.addEventListener(
    "DOMContentLoaded",
    init
);