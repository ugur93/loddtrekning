import { useSyncExternalStore } from "react";

export type Locale = "nb" | "tr";

const KEY = "lodd-locale";

const nb = {
  appTitle: "Loddtrekning",
  language: "Språk",
  stageScreen: "Storskjerm",
  undo: "Angre",
  undoToast: "Siste trekning er angret",
  confirmRound: "Ja, start ny runde",
  cancel: "Avbryt",
  roundToast: "Ny runde: samme lodd, tom vinnerliste",
  confirmReset: "Ja, tøm alt",
  resetToast: "Alt er tømt",
  newRound: "Ny runde",
  resetAll: "Tøm alt",
  eventLabel: "Navn på loddtrekningen",
  remaining: (n: number) => `${n} lodd igjen`,
  drawnCount: (n: number) => `${n} trukket`,
  bookCount: (n: number) => (n === 1 ? "1 bok" : `${n} bøker`),
  introTitle: "Rettferdig og spennende loddtrekning",
  introBody:
    "Legg inn de solgte loddene med bokstav, farge og nummer. Hvert trekk bruker ekte tilfeldighet, og et lodd kan aldri trekkes to ganger. Premier, vinnerliste og PDF er valgfritt.",
  fillExample: "Prøv med eksempelbøker",
  exampleHint: "Bok A og B, fire farger, 01–25",
  booksTitle: "Solgte lodd",
  booksHint: "En loddbok har én bokstav, fire farger og nummer 01–25.",
  bulkToggle: "Skriv inn som tekst",
  formToggle: "Tilbake til skjema",
  onePerLine: "Én linje per farge og bok",
  bulkPlaceholder: "Alle A-C 1-25\nRosa D 1-17\nBlå D 1-10, 12",
  bulkHint:
    "Farge (eller «Alle» for alle fire), bokstav og nummer. Bokstav: A, A-C eller A,C. Nummer: 7, 1-25 eller 1-10, 12.",
  addBulk: (n: number) => (n === 1 ? "Legg til 1 lodd" : `Legg til ${n} lodd`),
  color: "Farge",
  colors: "Farger",
  bookColors: "De fire bokfargene",
  otherColor: "Annen farge",
  addColor: "Legg til",
  pickColor: "Velg farge",
  letter: "Bokstav",
  bookLetter: "Bokstav på boka",
  letterAll: "Alle A–Y",
  letterNone: "Ingen",
  lettersPicked: (n: number) => (n === 1 ? "1 bok valgt" : `${n} bøker valgt`),
  from: "Fra nummer",
  to: "Til nummer",
  ticketsToAdd: (n: number) => (n === 1 ? "1 lodd" : `${n} lodd`),
  addBook: "Legg til lodd",
  needColor: "Velg minst én farge og én bokstav",
  badRange: "Ugyldige nummer. «Til» må være like stort som eller større enn «Fra».",
  badLines: "Fant ingen gyldige linjer. Eksempel: Rosa A 1-25",
  addedTickets: (n: number) => (n === 1 ? "La til 1 lodd" : `La til ${n} lodd`),
  noBooks: "Ingen lodd lagt inn ennå. Velg farger, bokstav og nummer over.",
  bookLabel: (letters: string, n: number) => (n === 1 ? `Bok ${letters}` : `Bøker ${letters}`),
  remainingOf: (left: number, total: number) => `${left} av ${total} lodd igjen`,
  removeBook: (letters: string) => `Fjern bok ${letters}`,
  prizes: "Premier",
  prizesHint: "Valgfritt. Premiene deles ut i rekkefølgen under.",
  prize: "Premie",
  prizePlaceholder: "f.eks. Marsipankake",
  changeImage: "Bytt bilde",
  prizeImage: "Legg til bilde",
  queue: "Legg til premie",
  prizeN: (n: number) => `Premie ${n}`,
  moveUp: "Flytt opp",
  moveDown: "Flytt ned",
  removePrize: "Fjern premie",
  needImage: "Velg en bildefil",
  imageFail: "Kunne ikke lese bildet",
  needPrize: "Skriv navnet på premien eller legg til et bilde",
  nextDraw: "Neste trekning",
  drawWinner: "Trekk vinner",
  among: (n: number) => `Blant ${n} solgte lodd som ikke er trukket ennå.`,
  drawMode: "Trekningsmåte",
  balanced: "Balansert",
  pureRandom: "Helt tilfeldig",
  balancedHint:
    "Farger, bokstaver og nummer som har vunnet mer enn sin andel, får litt lavere sjanse. Har samme farge eller bokstav vunnet to ganger på rad, må neste vinner være en annen.",
  randomHint: "Alle lodd som er igjen, har nøyaktig like stor sjanse.",
  chanceNext: "Sjanse i neste trekning",
  winnersSoFar: "Vinnere så langt",
  prizeQueued: "Neste premie",
  noPrize: "Ingen premier lagt inn. Du kan trekke likevel.",
  lastDrawn: "Sist trukket",
  allDrawn: "Alle lodd er trukket. Start en ny runde for å trekke på nytt.",
  needBooks: "Legg inn solgte lodd først",
  noneLeft: "Det er ingen lodd igjen å trekke",
  soundOn: "Slå på lyd",
  soundOff: "Slå av lyd",
  close: "Lukk",
  drawing: "Trekker …",
  number: "Nummer",
  locking: "Og vinneren er …",
  lastReel: "Siste hjul …",
  twoLeft: "To hjul igjen …",
  drum: "Hvem har vinnerloddet?",
  locked: "Låst",
  winnerIs: "Vinneren er",
  leftInPool: (n: number) => `${n} lodd igjen`,
  drawNext: "Trekk neste",
  done: "Ferdig",
  prizeWaiting: "Premien avsløres snart",
  winners: "Vinnere",
  winnersEmpty: "Vinnerne vises her. Et lodd som har vunnet, trekkes ikke igjen.",
  noWinnersYet: "Ingen vinnere ennå. Trykk «Trekk vinner» når du er klar.",
  exportPdf: "Lagre som PDF",
  popupBlocked: "Tillat popup-vinduer for å lagre PDF",
  noPrizeName: "Ingen premie",
  exitStage: "Avslutt storskjerm",
  ticketMark: "Lodd",
  savePdf: "Lagre som PDF",
  winnerList: "Vinnerliste",
  winnerWord: (n: number): string => (n === 1 ? "vinner" : "vinnere"),
  ticketCol: "Lodd",
  timeCol: "Tid",
  noWinnersPdf: "Ingen vinnere ennå.",
  pdfFoot: "Hvert lodd kan bare vinne én gang.",
};

type Msg = typeof nb;

const tr: Msg = {
  appTitle: "Çekiliş",
  language: "Dil",
  stageScreen: "Büyük ekran",
  undo: "Geri al",
  undoToast: "Son çekiliş geri alındı",
  confirmRound: "Evet, yeni tur başlat",
  cancel: "Vazgeç",
  roundToast: "Yeni tur: aynı biletler, boş kazanan listesi",
  confirmReset: "Evet, her şeyi sil",
  resetToast: "Her şey silindi",
  newRound: "Yeni tur",
  resetAll: "Her şeyi sil",
  eventLabel: "Çekilişin adı",
  remaining: (n) => `${n} bilet kaldı`,
  drawnCount: (n) => `${n} çekildi`,
  bookCount: (n) => `${n} defter`,
  introTitle: "Adil ve heyecanlı bir çekiliş",
  introBody:
    "Satılan biletleri harf, renk ve numarayla ekleyin. Her çekilişte gerçek rastgelelik kullanılır ve bir bilet asla iki kez çekilmez. Ödüller, kazanan listesi ve PDF isteğe bağlıdır.",
  fillExample: "Örnek defterlerle dene",
  exampleHint: "A ve B defteri, dört renk, 01–25",
  booksTitle: "Satılan biletler",
  booksHint: "Bir bilet defterinde bir harf, dört renk ve 01–25 arası numaralar vardır.",
  bulkToggle: "Metin olarak gir",
  formToggle: "Forma dön",
  onePerLine: "Her renk ve defter için bir satır",
  bulkPlaceholder: "Tümü A-C 1-25\nPembe D 1-17\nMavi D 1-10, 12",
  bulkHint:
    "Renk (dört renk için «Tümü»), harf ve numara. Harf: A, A-C veya A,C. Numara: 7, 1-25 veya 1-10, 12.",
  addBulk: (n) => `${n} bilet ekle`,
  color: "Renk",
  colors: "Renkler",
  bookColors: "Defterin dört rengi",
  otherColor: "Başka renk",
  addColor: "Ekle",
  pickColor: "Renk seç",
  letter: "Harf",
  bookLetter: "Defterin harfi",
  letterAll: "Tümü A–Y",
  letterNone: "Hiçbiri",
  lettersPicked: (n) => `${n} defter seçildi`,
  from: "İlk numara",
  to: "Son numara",
  ticketsToAdd: (n) => `${n} bilet`,
  addBook: "Biletleri ekle",
  needColor: "En az bir renk ve bir harf seçin",
  badRange: "Geçersiz numaralar. «Son» numara «İlk» numaradan küçük olamaz.",
  badLines: "Geçerli satır bulunamadı. Örnek: Pembe A 1-25",
  addedTickets: (n) => `${n} bilet eklendi`,
  noBooks: "Henüz bilet eklenmedi. Yukarıdan renk, harf ve numara seçin.",
  bookLabel: (letters, n) => (n === 1 ? `${letters} defteri` : `${letters} defterleri`),
  remainingOf: (left, total) => `${total} biletten ${left} tanesi kaldı`,
  removeBook: (letters) => `${letters} defterini kaldır`,
  prizes: "Ödüller",
  prizesHint: "İsteğe bağlı. Ödüller aşağıdaki sırayla verilir.",
  prize: "Ödül",
  prizePlaceholder: "örn. Lokum",
  changeImage: "Resmi değiştir",
  prizeImage: "Resim ekle",
  queue: "Ödülü ekle",
  prizeN: (n) => `${n}. ödül`,
  moveUp: "Yukarı taşı",
  moveDown: "Aşağı taşı",
  removePrize: "Ödülü kaldır",
  needImage: "Bir resim dosyası seçin",
  imageFail: "Resim okunamadı",
  needPrize: "Ödülün adını yazın veya bir resim ekleyin",
  nextDraw: "Sıradaki çekiliş",
  drawWinner: "Kazananı çek",
  among: (n) => `Henüz çekilmemiş ${n} satılmış bilet arasından.`,
  drawMode: "Çekiliş yöntemi",
  balanced: "Dengeli",
  pureRandom: "Tamamen rastgele",
  balancedHint:
    "Payından fazla kazanan renk, harf ve numaraların şansı biraz azalır. Aynı renk veya harf art arda iki kez kazandıysa, sıradaki kazanan farklı olmalıdır.",
  randomHint: "Kalan tüm biletlerin şansı tamamen eşittir.",
  chanceNext: "Sıradaki çekilişte şans",
  winnersSoFar: "Şimdiye kadarki kazananlar",
  prizeQueued: "Sıradaki ödül",
  noPrize: "Ödül eklenmedi. Yine de çekiliş yapabilirsiniz.",
  lastDrawn: "Son çekilen",
  allDrawn: "Tüm biletler çekildi. Yeniden çekmek için yeni bir tur başlatın.",
  needBooks: "Önce satılan biletleri ekleyin",
  noneLeft: "Çekilecek bilet kalmadı",
  soundOn: "Sesi aç",
  soundOff: "Sesi kapat",
  close: "Kapat",
  drawing: "Çekiliyor …",
  number: "Numara",
  locking: "Ve kazanan …",
  lastReel: "Son çark …",
  twoLeft: "İki çark kaldı …",
  drum: "Kazanan bilet kimde?",
  locked: "Kilitlendi",
  winnerIs: "Kazanan",
  leftInPool: (n) => `${n} bilet kaldı`,
  drawNext: "Sıradakini çek",
  done: "Bitti",
  prizeWaiting: "Ödül birazdan açıklanacak",
  winners: "Kazananlar",
  winnersEmpty: "Kazananlar burada görünür. Kazanan bir bilet tekrar çekilmez.",
  noWinnersYet: "Henüz kazanan yok. Hazır olduğunuzda «Kazananı çek»e basın.",
  exportPdf: "PDF olarak kaydet",
  popupBlocked: "PDF kaydetmek için açılır pencerelere izin verin",
  noPrizeName: "Ödül yok",
  exitStage: "Büyük ekrandan çık",
  ticketMark: "Bilet",
  savePdf: "PDF olarak kaydet",
  winnerList: "Kazanan listesi",
  winnerWord: () => "kazanan",
  ticketCol: "Bilet",
  timeCol: "Saat",
  noWinnersPdf: "Henüz kazanan yok.",
  pdfFoot: "Her bilet yalnızca bir kez kazanabilir.",
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
