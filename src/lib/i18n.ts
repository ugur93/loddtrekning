import { useSyncExternalStore } from "react";

export type Locale = "nb" | "tr";

const KEY = "lodd-locale";

const nb = {
  appTitle: "Loddtrekning",
  language: "Språk",
  stageScreen: "Storskjerm",
  undo: "Angre",
  undoToast: "Siste trekk angret",
  confirmRound: "Bekreft ny runde",
  cancel: "Avbryt",
  roundToast: "Ny runde — samme bøker, tom vinnerliste",
  confirmReset: "Bekreft tømming",
  resetToast: "Alt er tømt",
  newRound: "Ny runde",
  resetAll: "Tøm alt",
  eventLabel: "Navn på trekningen",
  remaining: (n: number) => `${n} lodd igjen`,
  drawnCount: (n: number) => `${n} trukket`,
  bookCount: (n: number) => (n === 1 ? "1 bok" : `${n} bøker`),
  introTitle: "En loddtrekning der samme lodd aldri trekkes to ganger",
  introBody:
    "Legg inn loddbøkene med farge, bokstav og nummer. Hvert trekk er tilfeldig blant solgte lodd, og det samme loddet kommer aldri opp igjen. Premiebilde, vinnerliste og PDF er valgfritt.",
  fillExample: "Fyll med eksempelbøker",
  exampleHint: "Rød, blå, gul og grønn A 1–100",
  booksTitle: "Loddbøker",
  booksHint: "Farge, bokstav og solgte nummer (1–100).",
  bulkToggle: "Hurtiginnlegging",
  formToggle: "Skjema",
  onePerLine: "Én bok per linje",
  bulkPlaceholder: "Rød A 1-100\nBlå L 1-59\nGul B 20-100",
  addBulk: (n: number) => (n === 1 ? "Legg til 1 bok" : `Legg til ${n} bøker`),
  color: "Farge",
  colorName: "Fargenavn",
  pickColor: "Velg farge",
  letter: "Bokstav",
  from: "Fra nummer",
  to: "Til nummer",
  addBook: "Legg til bok",
  needColor: "Farge og bokstav må fylles ut",
  badRange: "Ugyldig nummerområde",
  addedBook: (name: string, letter: string, from: number, to: number) =>
    `La til ${name} ${letter} ${from}–${to}`,
  badLines: "Fant ingen gyldige linjer. Format: Rød A 1–100",
  addedBooks: (n: number) => (n === 1 ? "La til 1 loddbok" : `La til ${n} loddbøker`),
  noBooks: "Ingen loddbøker ennå. Legg inn farge, bokstav og nummerområde for bøkene som er solgt.",
  remainingOf: (left: number, total: number) => `${left} av ${total} igjen`,
  removeBook: (name: string, letter: string) => `Fjern ${name} ${letter}`,
  prizes: "Premier",
  prizesHint: "Valgfritt. Neste premie i køen brukes automatisk ved trekning.",
  prize: "Premie",
  prizePlaceholder: "f.eks. Marsipankake",
  changeImage: "Bytt bilde",
  prizeImage: "Bilde av premie",
  queue: "Legg i kø",
  prizeN: (n: number) => `Premie ${n}`,
  moveUp: "Flytt opp",
  moveDown: "Flytt ned",
  removePrize: "Fjern premie",
  needImage: "Velg et bilde",
  imageFail: "Kunne ikke lese bildet",
  needPrize: "Skriv premienavn eller last opp bilde",
  nextDraw: "Neste trekk",
  drawWinner: "Trekk vinner",
  among: (n: number) =>
    `Blant ${n} lodd som kan trekkes. Samme farge og samme bokstav trekkes maks 2 ganger.`,
  prizeQueued: "Premie i kø",
  noPrize: "Ingen premie i kø — du kan likevel trekke lodd.",
  lastDrawn: "Sist trukket",
  allDrawn: "Alle lodd er trukket. Start ny runde for å trekke på nytt.",
  limitReached:
    "Samme farge eller bokstav er allerede trukket 2 ganger. Start ny runde for å trekke mer.",
  needBooks: "Legg til loddbøker først",
  noneLeft: "Ingen lodd igjen å trekke",
  soundOn: "Slå på lyd",
  soundOff: "Slå av lyd",
  close: "Lukk",
  drawing: "Trekker lodd",
  number: "Nummer",
  locking: "Låser resultatet…",
  lastReel: "Siste hjul ruller…",
  twoLeft: "To hjul igjen…",
  drum: "Hvem har loddet?",
  locked: "Låst",
  winnerIs: "Vinneren er",
  leftInPool: (n: number) => `${n} lodd igjen i puljen`,
  drawNext: "Trekk neste",
  done: "Ferdig",
  prizeWaiting: "Premien er forseglet",
  winners: "Vinnere",
  winnersEmpty: "Trukne lodd vises her og trekkes ikke igjen.",
  noWinnersYet: "Ingen vinnere ennå. Trykk Trekk vinner når bøkene er klare.",
  exportPdf: "Eksporter PDF",
  popupBlocked: "Tillat sprettoppvindu for å eksportere PDF",
  noPrizeName: "Uten premienavn",
  exitStage: "Avslutt storskjerm",
  ticketMark: "Lodd",
  savePdf: "Lagre som PDF",
  winnerList: "Vinnerliste",
  winnerWord: (n: number): string => (n === 1 ? "vinner" : "vinnere"),
  ticketCol: "Lodd",
  timeCol: "Tid",
  noWinnersPdf: "Ingen vinnere ennå.",
  pdfFoot: "Loddtrekning. Hvert lodd trekkes bare én gang.",
};

type Msg = typeof nb;

const tr: Msg = {
  appTitle: "Çekiliş",
  language: "Dil",
  stageScreen: "Büyük ekran",
  undo: "Geri al",
  undoToast: "Son çekiliş geri alındı",
  confirmRound: "Yeni turu onayla",
  cancel: "Vazgeç",
  roundToast: "Yeni tur — aynı defterler, boş kazanan listesi",
  confirmReset: "Temizlemeyi onayla",
  resetToast: "Her şey temizlendi",
  newRound: "Yeni tur",
  resetAll: "Tümünü temizle",
  eventLabel: "Çekiliş adı",
  remaining: (n) => `${n} bilet kaldı`,
  drawnCount: (n) => `${n} çekildi`,
  bookCount: (n) => (n === 1 ? "1 defter" : `${n} defter`),
  introTitle: "Aynı bilet bir daha çıkmayan bir çekiliş",
  introBody:
    "Bilet defterlerini renk, harf ve numara ile ekleyin. Her çekiliş satılan biletler arasından rastgele yapılır ve aynı bilet bir daha çıkmaz. Ödül resmi, kazanan listesi ve PDF isteğe bağlıdır.",
  fillExample: "Örnek defterlerle doldur",
  exampleHint: "Kırmızı, mavi, sarı ve yeşil A 1–100",
  booksTitle: "Bilet defterleri",
  booksHint: "Renk, harf ve satılan numaralar (1–100).",
  bulkToggle: "Hızlı giriş",
  formToggle: "Form",
  onePerLine: "Her satıra bir defter",
  bulkPlaceholder: "Kırmızı A 1-100\nMavi L 1-59\nSarı B 20-100",
  addBulk: (n) => (n === 1 ? "1 defter ekle" : `${n} defter ekle`),
  color: "Renk",
  colorName: "Renk adı",
  pickColor: "Renk seç",
  letter: "Harf",
  from: "Başlangıç",
  to: "Bitiş",
  addBook: "Defter ekle",
  needColor: "Renk ve harf doldurulmalı",
  badRange: "Geçersiz numara aralığı",
  addedBook: (name, letter, from, to) => `${name} ${letter} ${from}–${to} eklendi`,
  badLines: "Geçerli satır bulunamadı. Biçim: Kırmızı A 1–100",
  addedBooks: (n) => (n === 1 ? "1 bilet defteri eklendi" : `${n} bilet defteri eklendi`),
  noBooks: "Henüz bilet defteri yok. Satılan defterler için renk, harf ve numara aralığı ekleyin.",
  remainingOf: (left, total) => `${left} / ${total} kaldı`,
  removeBook: (name, letter) => `${name} ${letter} kaldır`,
  prizes: "Ödüller",
  prizesHint: "İsteğe bağlı. Sıradaki ödül çekilişte otomatik kullanılır.",
  prize: "Ödül",
  prizePlaceholder: "örn. Lokum",
  changeImage: "Resmi değiştir",
  prizeImage: "Ödül resmi",
  queue: "Sıraya ekle",
  prizeN: (n) => `Ödül ${n}`,
  moveUp: "Yukarı taşı",
  moveDown: "Aşağı taşı",
  removePrize: "Ödülü kaldır",
  needImage: "Bir resim seçin",
  imageFail: "Resim okunamadı",
  needPrize: "Ödül adı yazın veya resim yükleyin",
  nextDraw: "Sıradaki çekiliş",
  drawWinner: "Kazananı çek",
  among: (n) =>
    `${n} çekilebilir bilet. Aynı renk ve aynı harf en fazla 2 kez çekilir.`,
  prizeQueued: "Sıradaki ödül",
  noPrize: "Sırada ödül yok — yine de bilet çekebilirsiniz.",
  lastDrawn: "Son çekilen",
  allDrawn: "Tüm biletler çekildi. Yeniden çekmek için yeni tur başlatın.",
  limitReached: "Aynı renk veya harf zaten 2 kez çekildi. Devam etmek için yeni tur başlatın.",
  needBooks: "Önce bilet defteri ekleyin",
  noneLeft: "Çekilecek bilet kalmadı",
  soundOn: "Sesi aç",
  soundOff: "Sesi kapat",
  close: "Kapat",
  drawing: "Bilet çekiliyor",
  number: "Numara",
  locking: "Sonuç kilitleniyor…",
  lastReel: "Son çark dönüyor…",
  twoLeft: "İki çark kaldı…",
  drum: "Bilet kimde?",
  locked: "Kilitli",
  winnerIs: "Kazanan",
  leftInPool: (n) => `Havuzda ${n} bilet kaldı`,
  drawNext: "Sonrakini çek",
  done: "Bitti",
  prizeWaiting: "Ödül mühürlü",
  winners: "Kazananlar",
  winnersEmpty: "Çekilen biletler burada görünür ve bir daha çekilmez.",
  noWinnersYet: "Henüz kazanan yok. Defterler hazır olunca Kazananı çek’e basın.",
  exportPdf: "PDF indir",
  popupBlocked: "PDF için açılır pencereye izin verin",
  noPrizeName: "Ödül adı yok",
  exitStage: "Büyük ekrandan çık",
  ticketMark: "Bilet",
  savePdf: "PDF olarak kaydet",
  winnerList: "Kazanan listesi",
  winnerWord: (n) => (n === 1 ? "kazanan" : "kazanan"),
  ticketCol: "Bilet",
  timeCol: "Saat",
  noWinnersPdf: "Henüz kazanan yok.",
  pdfFoot: "Çekiliş. Her bilet yalnızca bir kez çekilir.",
};

const messages: Record<Locale, Msg> = { nb, tr };

let locale: Locale = "nb";
const listeners = new Set<() => void>();

function readStored(): Locale {
  try {
    const value = localStorage.getItem(KEY);
    if (value === "tr" || value === "nb") return value;
  } catch {
    /* ignore */
  }
  return "nb";
}

if (typeof window !== "undefined") locale = readStored();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLocale(next: Locale) {
  locale = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = next === "tr" ? "tr" : "nb";
  }
  listeners.forEach((listener) => listener());
}

export function useI18n() {
  const current = useSyncExternalStore(
    subscribe,
    () => locale,
    () => "nb" as Locale,
  );
  return { locale: current, setLocale, t: messages[current] };
}

export function localeTag(locale: Locale) {
  return locale === "tr" ? "tr-TR" : "nb-NO";
}
