import { colorLabel } from "@/lib/colors";
import { formatTicket } from "@/lib/tickets";
import type { Locale } from "@/lib/i18n";
import type { RaffleSnapshot } from "@/lib/types";

type PrintCopy = {
  lang: Locale;
  save: string;
  close: string;
  list: string;
  winners: string;
  ticket: string;
  prize: string;
  time: string;
  empty: string;
  foot: string;
};

function escapeHtml(value: string) {
  const amp = "\u0026";
  return value
    .replaceAll("&", `${amp}amp;`)
    .replaceAll("<", `${amp}lt;`)
    .replaceAll(">", `${amp}gt;`)
    .replaceAll('"', `${amp}quot;`);
}

export function openWinnersPrint(
  state: Pick<RaffleSnapshot, "eventName" | "winners">,
  copy: PrintCopy,
) {
  const tag = copy.lang === "tr" ? "tr-TR" : "nb-NO";
  const when = new Date().toLocaleDateString(tag, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const rows = [...state.winners].reverse();
  const body = rows
    .map((w, i) => {
      const img = w.prizeImage
        ? `<img class="prize" src="${w.prizeImage}" alt="" />`
        : "";
      return `<tr>
        <td class="nr">${i + 1}</td>
        <td>
          <span class="swatch" style="background:${escapeHtml(w.colorHex)}"></span>
          <strong>${escapeHtml(formatTicket(colorLabel(w.colorName, copy.lang), w.letter, w.number))}</strong>
        </td>
        <td>${escapeHtml(w.prizeName ?? "—")}${img}</td>
        <td class="time">${new Date(w.drawnAt).toLocaleTimeString(tag, { hour: "2-digit", minute: "2-digit" })}</td>
      </tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="${copy.lang}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(copy.list)} — ${escapeHtml(state.eventName)}</title>
  <style>
    @page { size: A4; margin: 16mm; }
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Figtree", "Segoe UI", sans-serif;
      color: #1c1814;
      background: #fff;
    }
    h1 { font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 28px; margin: 0 0 4px; }
    .meta { color: #6b635a; margin-bottom: 24px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b635a; border-bottom: 1px solid #e0d8cc; padding: 8px 6px; }
    td { padding: 10px 6px; border-bottom: 1px solid #efe8dc; vertical-align: middle; font-size: 14px; }
    .nr { width: 36px; color: #6b635a; font-variant-numeric: tabular-nums; }
    .time { width: 72px; color: #6b635a; font-variant-numeric: tabular-nums; }
    .swatch { display: inline-block; width: 10px; height: 10px; border-radius: 99px; margin-right: 8px; vertical-align: middle; outline: 1px solid rgba(0,0,0,.12); }
    .prize { display: block; width: 48px; height: 48px; object-fit: cover; border-radius: 6px; margin-top: 6px; }
    .foot { margin-top: 28px; font-size: 11px; color: #8a8178; }
    @media print { .noprint { display: none; } }
    .bar { display: flex; gap: 8px; margin-bottom: 20px; }
    button { font: inherit; padding: 8px 14px; border-radius: 10px; border: 0; background: #9f1d2c; color: #faf7f1; cursor: pointer; }
    button.ghost { background: #efe8dc; color: #1c1814; }
  </style>
</head>
<body>
  <div class="bar noprint">
    <button onclick="window.print()">${escapeHtml(copy.save)}</button>
    <button class="ghost" onclick="window.close()">${escapeHtml(copy.close)}</button>
  </div>
  <h1>${escapeHtml(state.eventName)}</h1>
  <p class="meta">${escapeHtml(copy.list)} · ${escapeHtml(when)} · ${rows.length} ${escapeHtml(copy.winners)}</p>
  <table>
    <thead>
      <tr><th>#</th><th>${escapeHtml(copy.ticket)}</th><th>${escapeHtml(copy.prize)}</th><th>${escapeHtml(copy.time)}</th></tr>
    </thead>
    <tbody>
      ${body || `<tr><td colspan="4">${escapeHtml(copy.empty)}</td></tr>`}
    </tbody>
  </table>
  <p class="foot">${escapeHtml(copy.foot)}</p>
  <script>window.addEventListener("load", () => setTimeout(() => window.print(), 250));</script>
</body>
</html>`;

  const win = window.open("", "_blank", "noopener,width=900,height=1200");
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}
