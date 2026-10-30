import { useState } from "react";
import { Download, Presentation, Trophy } from "lucide-react";
import { toast } from "sonner";
import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { WinnersBoard } from "@/components/winners-board";
import { openWinnersPrint } from "@/lib/export-pdf";
import { colorLabel } from "@/lib/colors";
import { localeTag, useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/tickets";
import { useRaffleStore } from "@/lib/store";

export function WinnersPanel() {
  const winners = useRaffleStore((s) => s.winners);
  const eventName = useRaffleStore((s) => s.eventName);
  const [board, setBoard] = useState(false);
  const { locale, t } = useI18n();

  function exportPdf() {
    const ok = openWinnersPrint(
      { eventName, winners },
      {
        lang: locale,
        save: t.savePdf,
        close: t.close,
        list: t.winnerList,
        winners: t.winnerWord(winners.length),
        ticket: t.ticketCol,
        prize: t.prize,
        time: t.timeCol,
        empty: t.noWinnersPdf,
        foot: t.pdfFoot,
      },
    );
    if (!ok) toast.error(t.popupBlocked);
  }

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl tracking-tight">{t.winners}</h2>
          <p className="text-sm text-muted">
            {winners.length === 0 ? t.winnersEmpty : t.drawnCount(winners.length)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setBoard(true)} disabled={winners.length === 0}>
            <Presentation className="size-4" />
            {t.showBoard}
          </Button>
          <Button variant="secondary" onClick={exportPdf} disabled={winners.length === 0}>
            <Download className="size-4" />
            {t.exportPdf}
          </Button>
        </div>
      </div>
      {board ? <WinnersBoard onClose={() => setBoard(false)} /> : null}

      {winners.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-muted">
          <Trophy className="size-8 opacity-40" />
          <p className="text-sm">{t.noWinnersYet}</p>
        </div>
      ) : (
        <ol className="grid gap-2">
          {winners.map((w, i) => (
            <li
              key={w.id}
              className="flex items-center gap-3 rounded-lg bg-bg p-2 shadow-[var(--shadow-border)]"
            >
              <span className="grid size-9 shrink-0 place-items-center font-ticket text-muted tabular-nums">
                {winners.length - i}
              </span>
              <TicketCard
                colorName={w.colorName}
                colorHex={w.colorHex}
                letter={w.letter}
                number={w.number}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {colorLabel(w.colorName, locale)} {w.letter} {formatNumber(w.number)}
                </p>
                <p className="truncate text-sm text-muted">
                  {w.prizeName ?? t.noPrizeName} ·{" "}
                  {new Date(w.drawnAt).toLocaleTimeString(localeTag(locale), {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {w.prizeImage ? (
                <img src={w.prizeImage} alt="" className="size-12 rounded-sm object-cover" />
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
