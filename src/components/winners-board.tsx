import { useEffect } from "react";
import { Trophy, X } from "lucide-react";
import { FullscreenButton } from "@/components/fullscreen-button";
import { LocaleSwitch } from "@/components/locale-switch";
import { TicketCard } from "@/components/ticket-card";
import { colorLabel } from "@/lib/colors";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/tickets";
import { useRaffleStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Big-screen list of all winners, first drawn first. Updates live as new winners are drawn. */
export function WinnersBoard({ onClose }: { onClose: () => void }) {
  const winners = useRaffleStore((s) => s.winners);
  const eventName = useRaffleStore((s) => s.eventName);
  const { locale, t } = useI18n();
  const ordered = [...winners].reverse();
  const latestId = winners[0]?.id;
  // Fewer winners → bigger tickets, so a short list still fills the screen.
  const size = ordered.length <= 6 ? "lg" : ordered.length <= 16 ? "md" : "sm";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-stage text-stage-fg"
      role="dialog"
      aria-modal="true"
      aria-label={t.winners}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgb(232 200 114 / 0.12), transparent 65%)",
        }}
      />
      <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-4">
        <p className="min-w-0 truncate text-sm tracking-[0.22em] text-stage-muted uppercase">
          {eventName}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <LocaleSwitch tone="stage" />
          <FullscreenButton tone="stage" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center gap-2 px-3 text-sm text-stage-muted hover:text-stage-fg"
          >
            <X className="size-4" />
            {t.close}
          </button>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-10 sm:px-8">
        <h2 className="text-center font-display text-4xl tracking-tight sm:text-6xl">
          {t.winners}
        </h2>
        <p className="mt-2 text-center text-stage-muted tabular-nums sm:text-lg">
          {t.drawnCount(winners.length)}
        </p>

        {ordered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-stage-muted">
            <Trophy className="size-12 opacity-40" />
            <p className="text-lg">{t.noWinnersYet}</p>
          </div>
        ) : (
          <ol
            className={cn(
              "mx-auto mt-8 grid max-w-[110rem] justify-center gap-4 sm:gap-6",
              size === "lg"
                ? "grid-cols-[repeat(auto-fit,minmax(min(100%,21rem),21rem))]"
                : size === "md"
                  ? "grid-cols-[repeat(auto-fit,minmax(min(100%,14.5rem),14.5rem))]"
                  : "grid-cols-[repeat(auto-fit,minmax(10rem,10rem))]",
            )}
          >
            {ordered.map((w, i) => (
              <li
                key={w.id}
                className={cn(
                  "rise-in flex flex-col items-center gap-2 rounded-xl p-3 text-center",
                  w.id === latestId ? "bg-stage-fg/12 ring-2 ring-[#e8c872]/70" : "bg-stage-fg/5",
                )}
              >
                <span
                  className={cn(
                    "font-ticket tabular-nums",
                    size === "sm" ? "text-lg" : "text-2xl",
                    w.id === latestId ? "text-[#e8c872]" : "text-stage-muted",
                  )}
                >
                  {i + 1}.
                </span>
                <TicketCard
                  colorName={w.colorName}
                  colorHex={w.colorHex}
                  letter={w.letter}
                  number={w.number}
                  size={size}
                />
                <p
                  className={cn(
                    "font-display tracking-tight",
                    size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base",
                  )}
                >
                  {colorLabel(w.colorName, locale)} {w.letter}{" "}
                  <span className="tabular-nums">{formatNumber(w.number)}</span>
                </p>
                {w.prizeName || w.prizeImage ? (
                  <div className="flex max-w-full items-center gap-2 text-stage-muted">
                    {w.prizeImage ? (
                      <img src={w.prizeImage} alt="" className="size-10 rounded-md object-cover" />
                    ) : null}
                    <span className={cn("truncate", size === "sm" ? "text-sm" : "text-base")}>
                      {w.prizeName}
                    </span>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
