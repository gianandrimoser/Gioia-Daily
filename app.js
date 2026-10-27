// Gioia Daily – App-Logik. Normalerweise musst du hier nichts ändern.
// Alle Einstellungen findest du in einstellungen.js.

(() => {
  const E = EINSTELLUNGEN;
  const SPEICHER = "gioia-daily-heute";
  const app = document.getElementById("app");

  // ---------- Farben aus den Einstellungen ----------
  const root = document.documentElement.style;
  const f = E.farben || {};
  if (f.hintergrund) root.setProperty("--bg", f.hintergrund);
  if (f.karte) root.setProperty("--karte", f.karte);
  if (f.gruen) root.setProperty("--gruen", f.gruen);
  if (f.gruenHell) root.setProperty("--gruen-hell", f.gruenHell);
  if (f.gold) root.setProperty("--gold", f.gold);
  document.title = E.appName;

  const rubriken = E.rubriken.map((r, i) => ({ ...r, id: r.ordner || "r" + i }));

  // ---------- Hilfsfunktionen ----------
  const heute = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };
  const zahl = (n) => (Math.round(n * 1000) / 1000).toLocaleString("de-CH", { maximumFractionDigits: 2 }).replace(".", ",");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const istBild = (s) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(s || "");
  const symbolHtml = (s) => (istBild(s) ? `<img src="${esc(s)}" alt="">` : esc(s));
  const uhrzeit = (t) => new Date(t).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });

  // ---------- Speicher (nur für heute) ----------
  let daten;
  function laden() {
    try { daten = JSON.parse(localStorage.getItem(SPEICHER)); } catch { daten = null; }
    if (!daten || daten.datum !== heute()) daten = { datum: heute(), eintraege: {}, belohnt: {} };
  }
  function speichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(daten)); } catch {}
  }
  const eintraege = (r) => daten.eintraege[r.id] || (daten.eintraege[r.id] = []);
  const summe = (r) => eintraege(r).reduce((a, e) => a + e.wert, 0);
  const erreicht = (r) => summe(r) >= r.ziel - 1e-9;
  const anteil = (r) => Math.min(1, summe(r) / r.ziel);

  function standText(r) {
    return `${zahl(summe(r))} / ${zahl(r.ziel)} ${r.einheit}`;
  }
  const einzahl = (r) => r.einheit.replace(/en$/, "").replace(/s$/, "");
  function eintragText(r, wert) {
    if (r.typ === "anzahl") return `1 ${einzahl(r)} ${r.name}`;
    return `${zahl(wert)} ${r.einheit} ${r.name}`;
  }

  // ---------- Startseite ----------
  function startseite() {
    const fertig = rubriken.filter(erreicht).length;
    const datum = new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long" });
    app.innerHTML = `
      <div class="ansicht">
        <header class="kopf">
          <p class="kopf-datum">${esc(datum)}</p>
          <h1 class="kopf-titel">${esc(E.appName)}</h1>
          ${E.untertitel ? `<p class="kopf-unter">${esc(E.untertitel)}</p>` : ""}
        </header>
        <div class="gesamt">
          <div class="gesamt-balken"><span style="width:${(fertig / rubriken.length) * 100}%"></span></div>
          <span>${fertig} von ${rubriken.length}</span>
        </div>
        <div class="raster">
          ${rubriken.map((r) => `
            <button class="karte ${erreicht(r) ? "fertig" : ""}" data-id="${esc(r.id)}">
              <span class="haken">✓</span>
              <div class="ring" style="--p:${anteil(r)}"><div class="ring-innen">${symbolHtml(r.symbol)}</div></div>
              <div class="name">${esc(r.name)}</div>
              <div class="stand">${esc(standText(r))}</div>
            </button>`).join("")}
        </div>
      </div>`;
    app.querySelectorAll(".karte").forEach((k) =>
      k.addEventListener("click", () => oeffnen(k.dataset.id)));
  }

  // ---------- Detailseite ----------
  let offen = null;
  function oeffnen(id) {
    offen = id;
    history.pushState({ id }, "");
    detail(true);
  }
  function detail(neu) {
    const r = rubriken.find((x) => x.id === offen);
    if (!r) return startseite();
    const liste = eintraege(r);
    const inputWert = neu ? "" : (app.querySelector("#menge")?.value || "");

    const eingabe = r.typ === "menge"
      ? `<div class="eingabe">
           ${(r.schnellwahl || []).length ? `<div class="schnell">${r.schnellwahl.map((w) =>
             `<button data-wert="${w}">+${zahl(w)} ${esc(r.einheit)}</button>`).join("")}</div>` : ""}
           <form class="feld-zeile" id="form">
             <label class="feld"><input id="menge" inputmode="decimal" autocomplete="off" placeholder="Andere Menge" value="${esc(inputWert)}"><span class="einheit">${esc(r.einheit)}</span></label>
             <button class="knopf" type="submit">Eintragen</button>
           </form>
         </div>`
      : `<div class="eingabe"><button class="knopf knopf-breit" id="plus">${esc(r.knopf || "+1")}</button></div>`;

    app.innerHTML = `
      <div class="${neu ? "ansicht" : ""}">
        <button class="zurueck" id="zurueck"><span>‹</span> Übersicht</button>
        <section class="detail-kopf">
          <div class="ring" style="--p:${anteil(r)}"><div class="ring-innen">${symbolHtml(r.symbol)}</div></div>
          <h1 class="detail-titel">${esc(r.name)}</h1>
          <p class="detail-stand"><b>${zahl(summe(r))}</b> von ${zahl(r.ziel)} ${esc(r.einheit)}</p>
          ${r.hinweis ? `<p class="detail-hinweis">${esc(r.hinweis)}</p>` : ""}
          ${erreicht(r) ? `<p class="detail-erreicht">✓ Ziel erreicht · <button id="nochmal">Belohnung ansehen</button></p>` : ""}
        </section>
        ${eingabe}
        <p class="liste-titel">Heute</p>
        <ul class="liste">
          ${liste.length ? liste.slice().reverse().map((e) => `
            <li>
              <span class="wert">${r.typ === "anzahl" ? `${esc(einzahl(r))} ${liste.indexOf(e) + 1}` : `${zahl(e.wert)} ${esc(r.einheit)}`}</span>
              <span class="zeit">${uhrzeit(e.zeit)}</span>
              <button class="weg" data-zeit="${e.zeit}" aria-label="Eintrag löschen">✕</button>
            </li>`).join("") : `<li class="leer">Noch nichts eingetragen.</li>`}
        </ul>
      </div>`;

    app.querySelector("#zurueck").onclick = () => history.back();
    app.querySelector("#nochmal")?.addEventListener("click", () => belohnen(r));
    app.querySelectorAll(".schnell button").forEach((b) =>
      b.addEventListener("click", () => eintragen(r, parseFloat(b.dataset.wert))));
    app.querySelector("#form")?.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const feld = app.querySelector("#menge");
      const w = parseFloat(String(feld.value).replace(",", ".").replace(/[^\d.]/g, ""));
      if (!(w > 0)) { feld.focus(); return; }
      feld.blur();
      eintragen(r, w, () => { feld.value = ""; });
    });
    app.querySelector("#plus")?.addEventListener("click", () => eintragen(r, 1));
    app.querySelectorAll(".weg").forEach((b) =>
      b.addEventListener("click", () => loeschen(r, Number(b.dataset.zeit))));
    if (neu) window.scrollTo(0, 0);
  }

  window.addEventListener("popstate", () => { offen = null; neuZeichnen(); });

  // ---------- Eintragen / Löschen ----------
  function eintragen(r, wert, danach) {
    fragen(r, eintragText(r, wert), () => {
      neuerTagPruefen();
      const vorher = erreicht(r);
      eintraege(r).push({ wert, zeit: Date.now() });
      speichern();
      danach && danach();
      neuZeichnen();
      if (!vorher && erreicht(r) && !daten.belohnt[r.id]) {
        daten.belohnt[r.id] = true;
        speichern();
        setTimeout(() => belohnen(r), 350);
      }
    });
  }
  function loeschen(r, zeit) {
    daten.eintraege[r.id] = eintraege(r).filter((e) => e.zeit !== zeit);
    if (!erreicht(r)) daten.belohnt[r.id] = false; // beim nächsten Erreichen gibt's wieder eine Belohnung
    speichern();
    neuZeichnen();
  }

  // ---------- Bestätigungs-Fenster ----------
  const frage = document.getElementById("frage");
  function fragen(r, eintrag, ja) {
    const B = E.bestaetigung || {};
    document.getElementById("frage-text").textContent = r.frage || B.frage || "Wirklich?";
    document.getElementById("frage-detail").textContent = (B.detail || "{eintrag}").replace("{eintrag}", eintrag);
    const bild = document.getElementById("frage-bild");
    const quelle = r.fragebild || B.bild;
    bild.hidden = !quelle;
    if (quelle) { bild.onerror = () => (bild.hidden = true); bild.src = quelle; }
    const jaK = document.getElementById("frage-ja");
    const neinK = document.getElementById("frage-nein");
    jaK.textContent = B.ja || "Ja";
    neinK.textContent = B.nein || "Nein";
    frage.hidden = false;
    const zu = () => { frage.hidden = true; jaK.onclick = neinK.onclick = frage.onclick = null; };
    jaK.onclick = () => { zu(); ja(); };
    neinK.onclick = zu;
    frage.onclick = (ev) => { if (ev.target === frage) zu(); };
  }

  // ---------- Belohnung ----------
  let bilderListe = null;
  async function bilderHolen() {
    try {
      const antwort = await fetch("bilder.json", { cache: "no-cache" });
      if (antwort.ok) bilderListe = await antwort.json();
    } catch {}
    return bilderListe || {};
  }
  const fenster = document.getElementById("belohnung");
  async function belohnen(r) {
    const B = E.belohnung || {};
    const liste = (await bilderHolen())[r.ordner] || [];
    const bild = document.getElementById("belohnung-bild");
    const symbol = document.getElementById("belohnung-symbol");
    document.getElementById("belohnung-titel").textContent = B.titel || "Ziel erreicht!";
    document.getElementById("belohnung-text").textContent = (B.text || "").replace("{rubrik}", r.name);
    document.getElementById("belohnung-ok").textContent = B.knopf || "Weiter";
    const zeigeSymbol = () => { bild.hidden = true; symbol.hidden = false; symbol.innerHTML = symbolHtml(r.symbol); };
    if (liste.length) {
      const datei = liste[Math.floor(Math.random() * liste.length)];
      symbol.hidden = true; bild.hidden = false;
      bild.onerror = zeigeSymbol;
      bild.src = `belohnungen/${encodeURIComponent(r.ordner)}/${encodeURIComponent(datei)}`;
    } else zeigeSymbol();
    // Funken neu starten
    const funken = fenster.querySelector(".funken");
    funken.replaceWith(funken.cloneNode(true));
    fenster.hidden = false;
    document.getElementById("belohnung-ok").onclick = () => { fenster.hidden = true; bild.removeAttribute("src"); };
  }

  // ---------- Reset um Mitternacht ----------
  function neuerTagPruefen() {
    if (daten.datum !== heute()) { laden(); return true; }
    return false;
  }
  function neuZeichnen() { offen ? detail(false) : startseite(); }
  setInterval(() => { if (neuerTagPruefen()) neuZeichnen(); }, 20000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") { laden(); neuZeichnen(); }
  });

  // ---------- Start ----------
  laden();
  startseite();
  bilderHolen();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
