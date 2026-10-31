import { create } from "zustand";
import { colorFromName } from "@/lib/colors";
import { persist } from "zustand/middleware";
import {
  EXAMPLE_BOOKS,
  expandPool,
  pickTicket,
  remainingInBook,
  ticketKey,
  winnerFromTicket,
  withoutDuplicates,
} from "@/lib/tickets";
import type { DrawMode } from "@/lib/fair-draw";
import type { BookGrouping, Prize, RaffleSnapshot, TicketBook, Winner } from "@/lib/types";

type DrawResult =
  | { ok: true; winner: Winner; remaining: number }
  | { ok: false; reason: "empty" | "none" };

type RaffleState = RaffleSnapshot & {
  /** Adds tickets, skipping any that already exist. Returns ticket counts. */
  addBooks: (books: Omit<TicketBook, "id">[]) => { added: number; skipped: number };
  removeBook: (id: string) => void;
  setEventName: (name: string) => void;
  addPrize: (prize: Omit<Prize, "id"> & { id?: string }) => void;
  removePrize: (id: string) => void;
  movePrize: (id: string, dir: -1 | 1) => void;
  draw: () => DrawResult;
  undoLast: () => void;
  newRound: () => void;
  resetAll: () => void;
  loadExample: () => void;
  setStageMode: (on: boolean) => void;
  setDrawMode: (mode: DrawMode) => void;
  setBookGrouping: (grouping: BookGrouping) => void;
};

const OLD_HEX = new Set(["#1565C0", "#D4A017", "#2E7D32", "#C2185B"]);

const initial: RaffleSnapshot = {
  eventName: "Loddtrekning",
  books: [],
  prizes: [],
  winners: [],
  drawnKeys: [],
  stageMode: false,
  drawMode: "random",
  bookGrouping: "none",
};

export const useRaffleStore = create<RaffleState>()(
  persist(
    (set, get) => ({
      ...initial,
      setEventName: (eventName) => set({ eventName }),
      addBooks: (books) => {
        const { books: fresh, added, skipped } = withoutDuplicates(get().books, books);
        set((s) => ({
          books: [...s.books, ...fresh.map((b) => ({ ...b, id: crypto.randomUUID() }))],
        }));
        return { added, skipped };
      },
      removeBook: (id) =>
        set((s) => ({
          books: s.books.filter((b) => b.id !== id),
          drawnKeys: s.drawnKeys.filter((k) => !k.startsWith(`${id}:`)),
        })),
      addPrize: (prize) =>
        set((s) => ({
          prizes: [...s.prizes, { ...prize, id: prize.id ?? crypto.randomUUID() }],
        })),
      removePrize: (id) => set((s) => ({ prizes: s.prizes.filter((p) => p.id !== id) })),
      movePrize: (id, dir) =>
        set((s) => {
          const i = s.prizes.findIndex((p) => p.id === id);
          if (i < 0) return s;
          const j = i + dir;
          if (j < 0 || j >= s.prizes.length) return s;
          const next = s.prizes.slice();
          const [row] = next.splice(i, 1);
          if (!row) return s;
          next.splice(j, 0, row);
          return { prizes: next };
        }),
      draw: () => {
        const { books, drawnKeys, prizes, winners } = get();
        if (books.length === 0) return { ok: false, reason: "empty" };
        const pool = expandPool(books, drawnKeys);
        const ticket = pickTicket(pool, winners, get().drawMode);
        if (!ticket) return { ok: false, reason: "none" };
        const [prize, ...rest] = prizes;
        const winner = winnerFromTicket(ticket, prize);
        set((s) => ({
          winners: [winner, ...s.winners],
          drawnKeys: [...s.drawnKeys, ticket.key],
          prizes: rest,
        }));
        return { ok: true, winner, remaining: pool.length - 1 };
      },
      undoLast: () =>
        set((s) => {
          const [last, ...rest] = s.winners;
          if (!last) return s;
          const key = ticketKey(last.bookId, last.number);
          const restoredPrize: Prize | null = last.prizeName
            ? {
                id: crypto.randomUUID(),
                name: last.prizeName,
                imageDataUrl: last.prizeImage,
              }
            : null;
          return {
            winners: rest,
            drawnKeys: s.drawnKeys.filter((k) => k !== key),
            prizes: restoredPrize ? [restoredPrize, ...s.prizes] : s.prizes,
          };
        }),
      newRound: () => set({ winners: [], drawnKeys: [] }),
      resetAll: () =>
        set({ ...initial, eventName: get().eventName, bookGrouping: get().bookGrouping }),
      loadExample: () =>
        set((s) => ({
          books:
            s.books.length === 0
              ? EXAMPLE_BOOKS.map((b) => ({ ...b, id: crypto.randomUUID() }))
              : s.books,
        })),
      setStageMode: (stageMode) => set({ stageMode }),
      setDrawMode: (drawMode) => set({ drawMode }),
      setBookGrouping: (bookGrouping) => set({ bookGrouping }),
    }),
    {
      name: "lodd-raffle-v1",
      version: 3,
      // v2: the four book colors became pastel; recolor saved books and winners.
      // v3: pure random became the default draw.
      migrate: (persisted, version) => {
        const state = persisted as RaffleSnapshot;
        if (version < 2) {
          const recolor = <T extends { colorName: string; colorHex: string }>(row: T): T => {
            const known = colorFromName(row.colorName);
            return known && OLD_HEX.has(row.colorHex.toUpperCase())
              ? { ...row, colorHex: known.hex }
              : row;
          };
          state.books = (state.books ?? []).map(recolor);
          state.winners = (state.winners ?? []).map(recolor);
        }
        if (version < 3) state.drawMode = "random";
        return state;
      },
      skipHydration: true,
      partialize: (s) => ({
        eventName: s.eventName,
        books: s.books,
        prizes: s.prizes,
        winners: s.winners,
        drawnKeys: s.drawnKeys,
        stageMode: s.stageMode,
        drawMode: s.drawMode,
        bookGrouping: s.bookGrouping,
      }),
    },
  ),
);

export function usePoolCount() {
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  return expandPool(books, drawnKeys).length;
}

export function useBookRemaining(book: TicketBook) {
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  return remainingInBook(book, drawnKeys);
}
