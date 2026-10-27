// =====================================================================
//  GIOIA DAILY – EINSTELLUNGEN
// ---------------------------------------------------------------------
//  Hier kannst du alles anpassen: Ziele, Symbole, Texte, Farben.
//  So geht's auf GitHub: Datei öffnen → Stift-Symbol (Edit) →
//  ändern → "Commit changes" drücken. Nach 1–2 Minuten ist es live.
//
//  Drei Regeln, damit nichts kaputtgeht:
//   1. Texte immer in "Anführungszeichen".
//   2. Nach jedem Eintrag ein Komma , (wie unten).
//   3. Kommazahlen mit PUNKT schreiben: 0.5 (nicht 0,5).
// =====================================================================

const EINSTELLUNGEN = {

  // ---- App ----------------------------------------------------------
  appName: "Gioia Daily",
  untertitel: "Erfüll di Sache und bechum e Belohnig 😉",

  // ---- Farben (Farbcodes, z.B. von htmlcolorcodes.com) --------------
  farben: {
    hintergrund: "#EFE6D6",   // Beige
    karte:       "#FAF6EE",   // helles Beige für die Kästchen
    gruen:       "#1E3A2B",   // Dunkelgrün
    gruenHell:   "#6B8A72",   // helleres Grün für Nebentexte
    gold:        "#B8935A",   // Akzent
  },

  // ---- Bestätigungs-Fenster vor jedem Eintrag ----------------------
  //  {eintrag} wird automatisch ersetzt, z.B. durch "0,5 L Wasser".
  //  bild: Pfad zu einem Bild/GIF. Leer lassen ("") = kein Bild.
  bestaetigung: {
    frage: "Ganz sicher dases gmacht hesch?",
    detail: "{eintrag}",
    ja:   "Natüalisch 😁",
    nein: "Scusi 🫣",
    bild: "hundsideeye.jpg",
  },

  // ---- Belohnungs-Fenster -------------------------------------------
  //  {rubrik} wird durch den Namen der Rubrik ersetzt.
  belohnung: {
    titel: "Ziel erreicht!",
    text:  "{rubrik} für heute geschafft.",
    knopf: "Weiter",
  },

  // ---- Die Rubriken -------------------------------------------------
  //  name:     Anzeigename
  //  symbol:   ein Emoji (einfach reinkopieren, z.B. von emojipedia.org)
  //            ODER ein Bild-Pfad, z.B. "bilder/wasser-symbol.png"
  //  typ:      "menge"  = man tippt eine Zahl ein (Kommazahlen erlaubt)
  //            "anzahl" = jeder Klick zählt 1
  //  ziel:     Tagesziel
  //  einheit:  wird hinter der Zahl angezeigt
  //  hinweis:  kleiner Zusatztext (optional, "" = keiner)
  //  schnellwahl: Knöpfe für häufige Mengen (nur bei typ "menge")
  //  knopf:    Text auf dem Knopf (nur bei typ "anzahl")
  //  ordner:   Name des Ordners in "belohnungen", aus dem das
  //            Belohnungsbild zufällig gewählt wird
  //  frage / fragebild (optional): eigene Frage / eigenes Bild nur
  //            für diese Rubrik, sonst gilt das von oben.
  rubriken: [
    {
      name: "Wasser",
      symbol: "💧",
      typ: "menge",
      ziel: 2,
      einheit: "L",
      hinweis: "",
      schnellwahl: [0.25, 0.33, 0.5],
      ordner: "wasser",
    },
    {
      name: "Proteine",
      symbol: "💪",
      typ: "menge",
      ziel: 60,
      einheit: "g",
      hinweis: "",
      schnellwahl: [10, 20, 30],
      ordner: "proteine",
    },
    {
      name: "Handcreme",
      symbol: "🤲",
      typ: "anzahl",
      ziel: 2,
      einheit: "Anwendungen",
      hinweis: "",
      knopf: "+1 Anwendung",
      ordner: "handcreme",
    },
    {
      name: "Lippenpomade",
      symbol: "💋",
      typ: "anzahl",
      ziel: 3,
      einheit: "Anwendungen",
      hinweis: "",
      knopf: "+1 Anwendung",
      ordner: "lippenpomade",
    },
    {
      name: "Body Lotion",
      symbol: "🧴",
      typ: "anzahl",
      ziel: 1,
      einheit: "Anwendung",
      hinweis: "",
      knopf: "+1 Anwendung",
      ordner: "bodylotion",
    },
    {
      name: "Workout",
      symbol: "🏋️‍♀️",
      typ: "anzahl",
      ziel: 6,
      einheit: "Sets",
      hinweis: "1 Set = 10 Wiederholungen",
      knopf: "+1 Set (10×)",
      ordner: "workout",
    },
  ],
};
