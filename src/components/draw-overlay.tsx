import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { ConfettiCanvas } from "@/components/confetti-canvas";
import { FullscreenButton } from "@/components/fullscreen-button";
import { LocaleSwitch } from "@/components/locale-switch";
import { SlotReel, type SlotItem } from "@/components/slot-reel";
import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { colorLabel } from "@/lib/colors";
import {
  getDrawMuted,
  BEAT_MS,
  MUSIC_LEAD_MS,
  playFanfare,
  playLock,
  playTick,
  setDrawMuted,
  setSpinStage,
  startDrawAmbience,
  stopDrawSound,
  unlockDrawAudio,
} from "@/lib/draw-audio";
import { expandPool, formatNumber } from "@/lib/tickets";
import type { PoolTicket, Winner } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useRaffleStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Phase = "spin" | "reveal";

type Props = {
  winner: Winner;
  remaining: number;
  onClose: () => void;
  onDrawAgain: () => void;
};

const ITEM_H = 76;

const REELS = ["color", "letter", "number"] as const;
/** Reels land on beats 6, 8 and 10 of the music; the winner is revealed on beat 12. */
const LAND_BEATS = [6, 8, 10];
const landAt = (reel: number) => MUSIC_LEAD_MS + LAND_BEATS[reel]! * BEAT_MS;
const REVEAL_AFTER_MS = 2 * BEAT_MS;

export function DrawOverlay({ winner, remaining, onClose, onDrawAgain }: Props) {
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  const winners = useRaffleStore((s) => s.winners);
  const [phase, setPhase] = useState<Phase>("spin");
  const [locked, setLocked] = useState({ color: false, letter: false, number: false });
  const [muted, setMuted] = useState(false);
  const { locale, t } = useI18n();
  const revealTimer = useRef(0);
  const revealed = useRef(false);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const colorItems = useMemo<SlotItem[]>(() => {
    const seen = new Set<string>();
    const out: SlotItem[] = [];
    for (const b of books) {
      const id = b.colorName.toUpperCase();
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({ id, label: b.colorName, color: b.colorHex });
    }
    if (!seen.has(winner.colorName.toUpperCase())) {
      out.unshift({
        id: winner.colorName.toUpperCase(),
        label: winner.colorName,
        color: winner.colorHex,
      });
    }
    return out;
  }, [books, winner.colorHex, winner.colorName]);

  const letterItems = useMemo<SlotItem[]>(() => {
    const fromBooks = Array.from(new Set(books.map((b) => b.letter.toUpperCase())));
    const win = winner.letter.toUpperCase();
    const base = fromBooks.length >= 3 ? fromBooks : "ABCDEFGHJKLMNPRSTUVWXY".split("");
    const ids = new Set(base);
    ids.add(win);
    return [...ids].map((l) => ({ id: l, label: l }));
  }, [books, winner.letter]);

  // Decoys are real sold numbers, so the reel never shows a number nobody has.
  const numberItems = useMemo<SlotItem[]>(() => {
    const sold = new Set<number>();
    for (const b of books) {
      for (let n = b.from; n <= b.to && sold.size < 4000; n++) sold.add(n);
    }
    sold.delete(winner.number);
    const others = [...sold];
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j]!, others[i]!];
    }
    return [winner.number, ...others.slice(0, 17)].map((n) => ({
      id: String(n),
      label: formatNumber(n),
    }));
  }, [books, winner.number]);

  const tickerTickets = useMemo(() => {
    const pool = expandPool(books, drawnKeys);
    const out: (PoolTicket & { key: string })[] = [];
    for (let i = 0; i < Math.min(16, pool.length); i++) {
      const ticket = pool[Math.floor(Math.random() * pool.length)]!;
      out.push({ ...ticket, key: `${ticket.key}-${i}` });
    }
    return out;
    // Re-sample only per draw, not when drawnKeys changes mid-spin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, winner.id]);

  const confettiColors = useMemo(
    () => [...new Set([...books.map((b) => b.colorHex), winner.colorHex, "#f4efe6", "#9f1d2c"])],
    [books, winner.colorHex],
  );

  useEffect(() => {
    setMuted(getDrawMuted());
  }, []);

  useEffect(() => {
    window.clearTimeout(revealTimer.current);
    revealed.current = false;
    setPhase("spin");
    setLocked({ color: false, letter: false, number: false });
    if (reduced) {
      setPhase("reveal");
      playFanfare();
      return;
    }
    unlockDrawAudio();
    startDrawAmbience();
    return () => {
      window.clearTimeout(revealTimer.current);
      stopDrawSound();
    };
  }, [winner.id, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "reveal") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, phase]);

  function lock(which: "color" | "letter" | "number") {
    setLocked((s) => {
      if (s[which]) return s;
      playLock(REELS.indexOf(which));
      const next = { ...s, [which]: true };
      const count = Number(next.color) + Number(next.letter) + Number(next.number);
      setSpinStage(count);
      if (next.color && next.letter && next.number && !revealed.current) {
        revealed.current = true;
        revealTimer.current = window.setTimeout(() => {
          playFanfare();
          setPhase("reveal");
        }, REVEAL_AFTER_MS);
      }
      return next;
    });
  }

  const charge = Number(locked.color) + Number(locked.letter) + Number(locked.number);
  const colorText = colorLabel(winner.colorName, locale);
  const machineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = machineRef.current;
    if (!el || charge === 0) return;
    el.classList.remove("lock-hit");
    void el.offsetWidth;
    el.classList.add("lock-hit");
  }, [charge]);

  function toggleMute() {
    unlockDrawAudio();
    const next = !muted;
    setMuted(next);
    setDrawMuted(next);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-stage text-stage-fg"
      role="dialog"
      aria-modal="true"
      aria-label={t.appTitle}
    >
      <div
        className={cn("stage-spot", phase === "spin" && "is-live", charge > 1 && "is-tight")}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, rgb(244 239 230 / 0.1), transparent 62%)",
        }}
      />
      <ConfettiCanvas active={phase === "reveal"} colors={confettiColors} />

      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <p className="text-sm tracking-[0.22em] text-stage-muted uppercase">{t.appTitle}</p>
        <div className="flex items-center gap-1">
          <LocaleSwitch tone="stage" />
          <FullscreenButton tone="stage" />
          <button
            type="button"
            onClick={toggleMute}
            className="grid size-11 place-items-center rounded-md text-stage-muted hover:bg-stage-fg/10 hover:text-stage-fg"
            aria-label={muted ? t.soundOn : t.soundOff}
            aria-pressed={!muted}
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          {phase === "reveal" ? (
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-3 text-sm text-stage-muted hover:text-stage-fg"
            >
              {t.close}
            </button>
          ) : null}
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-8">
        {phase === "spin" ? (
          <div className="w-full max-w-xl">
            {tickerTickets.length > 0 ? (
              <div className="ticket-ticker mb-6" aria-hidden>
                <div className="ticket-ticker-track">
                  {[...tickerTickets, ...tickerTickets].map((t, i) => (
                    <TicketCard
                      key={`${t.key}-${i}`}
                      colorName={t.colorName}
                      colorHex={t.colorHex}
                      letter={t.letter}
                      number={t.number}
                      size="sm"
                      className="shrink-0"
                    />
                  ))}
                </div>
              </div>
            ) : null}
            <p className="mb-5 text-center font-display text-2xl tracking-tight sm:text-3xl">
              {t.drawing}
            </p>
            <div
              ref={machineRef}
              className={cn("machine", charge > 0 && "is-charged", charge > 1 && "is-charged-2")}
            >
              <div className="machine-lamp" aria-hidden />
              <div className="machine-bulbs" aria-hidden>
                <span className={locked.color ? "on" : undefined} />
                <span className={locked.letter ? "on" : undefined} />
                <span className={locked.number ? "on" : undefined} />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <ReelCol label={t.color} locked={locked.color} lockedLabel={t.locked}>
                  <SlotReel
                    key={`${winner.id}-color`}
                    items={colorItems}
                    winnerId={winner.colorName.toUpperCase()}
                    durationMs={landAt(0) - 40}
                    delayMs={40}
                    itemHeight={ITEM_H}
                    reduced={reduced}
                    locked={locked.color}
                    kind="color"
                    onTick={playTick}
                    onStop={() => lock("color")}
                  />
                </ReelCol>
                <ReelCol label={t.letter} locked={locked.letter} lockedLabel={t.locked}>
                  <SlotReel
                    key={`${winner.id}-letter`}
                    items={letterItems}
                    winnerId={winner.letter.toUpperCase()}
                    durationMs={landAt(1) - 120}
                    delayMs={120}
                    itemHeight={ITEM_H}
                    reduced={reduced}
                    locked={locked.letter}
                    onTick={playTick}
                    onStop={() => lock("letter")}
                  />
                </ReelCol>
                <ReelCol label={t.number} locked={locked.number} lockedLabel={t.locked}>
                  <SlotReel
                    key={`${winner.id}-number`}
                    items={numberItems}
                    winnerId={String(winner.number)}
                    durationMs={landAt(2) - 200}
                    delayMs={200}
                    itemHeight={ITEM_H}
                    reduced={reduced}
                    locked={locked.number}
                    onTick={playTick}
                    onStop={() => lock("number")}
                  />
                </ReelCol>
              </div>
            </div>
            {(winner.prizeName || winner.prizeImage) && (
              <p className="sealed">{t.prizeWaiting}</p>
            )}
            <p className="mt-4 text-center text-sm text-stage-muted">
              {locked.number
                ? t.locking
                : locked.letter
                  ? t.lastReel
                  : locked.color
                    ? t.twoLeft
                    : t.drum}
            </p>
          </div>
        ) : (
          <div className="flex w-full max-w-lg flex-col items-center text-center" aria-live="assertive">
            <p className="rise-in text-sm tracking-[0.28em] text-stage-muted uppercase">{t.winnerIs}</p>
            <div className="relative mt-5">
              <div className="winner-ring" aria-hidden />
              <div className="winner-ring delay" aria-hidden />
              <div className="winner-halo" aria-hidden />
              <div className="ticket-pop relative z-10">
              <TicketCard
                colorName={winner.colorName}
                colorHex={winner.colorHex}
                letter={winner.letter}
                number={winner.number}
                size="hero"
              />
              </div>
            </div>
            <p className="rise-in stagger-2 mt-6 font-display text-3xl tracking-tight sm:text-4xl">
              {colorText} {winner.letter}{" "}
              <span className="tabular-nums">{formatNumber(winner.number)}</span>
            </p>
            {winner.prizeName || winner.prizeImage ? (
              <div className="rise-in stagger-3 mt-5 flex items-center gap-3 rounded-lg bg-stage-fg/10 px-4 py-3">
                {winner.prizeImage ? (
                  <img src={winner.prizeImage} alt="" className="size-16 rounded-md object-cover" />
                ) : null}
                <div className="text-left">
                  <p className="text-xs tracking-wide text-stage-muted uppercase">{t.prize}</p>
                  <p className="font-medium">{winner.prizeName ?? t.prize}</p>
                </div>
              </div>
            ) : null}
            <p className="mt-4 text-sm text-stage-muted tabular-nums">{t.leftInPool(remaining)}</p>
            <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="stage" size="lg" onClick={onDrawAgain} disabled={remaining === 0}>
                {t.drawNext}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-stage-fg hover:bg-stage-fg/10"
                onClick={onClose}
              >
                {t.done}
              </Button>
            </div>
          </div>
        )}
      </div>
      <WinnersRail
        winners={phase === "reveal" ? winners : winners.filter((w) => w.id !== winner.id)}
        freshId={phase === "reveal" ? winner.id : undefined}
      />
      </div>
    </div>
  );
}

export function WinnersRail({ winners, freshId }: { winners: Winner[]; freshId?: string }) {
  const { locale, t } = useI18n();
  if (winners.length === 0) return null;
  return (
    <aside
      className="shrink-0 border-t border-stage-fg/10 bg-stage-fg/[0.03] lg:w-80 lg:border-t-0 lg:border-l"
      aria-label={t.winnersSoFar}
    >
      <p className="px-4 pt-3 text-xs tracking-widest text-stage-muted uppercase lg:pt-5">
        {t.winnersSoFar} · <span className="tabular-nums">{winners.length}</span>
      </p>
      <ol className="flex gap-3 overflow-x-auto px-4 py-3 lg:max-h-[calc(100dvh-8rem)] lg:flex-col lg:gap-2 lg:overflow-x-visible lg:overflow-y-auto">
        {winners.map((w, i) => (
          <li
            key={w.id}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg p-1.5 lg:p-2",
              w.id === freshId ? "rise-in bg-stage-fg/15 ring-1 ring-stage-fg/40" : "bg-stage-fg/5",
            )}
          >
            <span className="w-6 text-center font-ticket text-sm text-stage-muted tabular-nums">
              {winners.length - i}
            </span>
            <TicketCard
              colorName={w.colorName}
              colorHex={w.colorHex}
              letter={w.letter}
              number={w.number}
              size="sm"
            />
            <div className="hidden min-w-0 flex-1 lg:block">
              <p className="truncate text-sm font-medium">
                {colorLabel(w.colorName, locale)} {w.letter} {formatNumber(w.number)}
              </p>
              {w.prizeName ? (
                <p className="truncate text-xs text-stage-muted">{w.prizeName}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function ReelCol({
  label,
  locked,
  lockedLabel,
  children,
}: {
  label: string;
  locked: boolean;
  lockedLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-center text-xs tracking-widest text-stage-muted uppercase">{label}</p>
      {children}
      <p
        className={cn(
          "mt-1.5 h-5 text-center text-xs tracking-wide uppercase",
          locked ? "text-stage-fg" : "text-transparent",
        )}
      >
        {lockedLabel}
      </p>
    </div>
  );
}
