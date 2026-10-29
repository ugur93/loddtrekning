import { useEffect, useMemo, useRef } from "react";
import { colorLabel, ticketInk } from "@/lib/colors";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type SlotItem = {
  id: string;
  label: string;
  color?: string;
};

type Props = {
  items: SlotItem[];
  winnerId: string;
  durationMs: number;
  delayMs?: number;
  itemHeight?: number;
  reduced?: boolean;
  locked?: boolean;
  kind?: "color" | "plain";
  onTick?: () => void;
  onStop?: () => void;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(list: T[], seed: string) {
  const a = list.slice();
  const rand = mulberry32(
    seed.split("").reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261),
  );
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

function buildStrip(items: SlotItem[], winnerId: string, seed: string): SlotItem[] {
  const pool = items.length ? items : [{ id: winnerId, label: winnerId }];
  const win = pool.find((x) => x.id === winnerId) ?? { id: winnerId, label: winnerId };
  const rest = pool.filter((x) => x.id !== winnerId);
  let cycle = rest.length ? rest : pool;
  if (cycle.length > 8) cycle = seededShuffle(cycle, seed).slice(0, 8);
  const loops = cycle.length >= 6 ? 4 : Math.min(10, Math.ceil(24 / cycle.length));
  const strip: SlotItem[] = [];
  for (let loop = 0; loop < loops; loop++) {
    strip.push(...seededShuffle(cycle, `${seed}:${loop}`));
  }
  if (strip[strip.length - 1]?.id === win.id) {
    const alt = cycle.find((x) => x.id !== win.id);
    if (alt) strip.push(alt);
  }
  strip.push(win);
  return strip;
}

/**
 * Firm ease-out: the reel keeps visibly moving until the very end, so the
 * value lands at the same moment onStop fires (sound + light). A softer curve
 * like quint looks stopped ~1s before it reports done.
 */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 1.7);
}

export function SlotReel({
  items,
  winnerId,
  durationMs,
  delayMs = 0,
  itemHeight = 76,
  reduced,
  locked,
  kind = "plain",
  onTick,
  onStop,
}: Props) {
  const strip = useMemo(
    () => buildStrip(items, winnerId, `${winnerId}:${durationMs}`),
    [items, winnerId, durationMs],
  );
  const stripRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef(onTick);
  const stopRef = useRef(onStop);
  tickRef.current = onTick;
  stopRef.current = onStop;

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const target = (strip.length - 1) * itemHeight;
    const setY = (y: number) => {
      el.style.transform = `translate3d(0, ${-y}px, 0)`;
    };

    if (reduced) {
      setY(target);
      stopRef.current?.();
      return;
    }

    setY(0);
    let raf = 0;
    let lastCell = 0;
    let lastTickAt = 0;
    let cancelled = false;
    const start = performance.now();

    const frame = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      if (elapsed < delayMs) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const t = Math.min(1, (elapsed - delayMs) / durationMs);
      const y = easeOut(t) * target;
      setY(y);
      const cell = Math.floor(y / itemHeight);
      if (cell !== lastCell) {
        lastCell = cell;
        if (t > 0.15 && now - lastTickAt > 85) {
          lastTickAt = now;
          tickRef.current?.();
        }
      }
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        setY(target);
        if (!cancelled) stopRef.current?.();
      }
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [strip, itemHeight, durationMs, delayMs, reduced]);

  return (
    <div className={cn("reel-window", locked && "is-locked")} style={{ height: itemHeight }}>
      <div className="reel-window-mask" aria-hidden />
      <div className="reel-select" aria-hidden />
      <div ref={stripRef} className="will-change-transform">
        {strip.map((item, i) => (
          <ReelCell key={`${item.id}-${i}`} item={item} height={itemHeight} kind={kind} />
        ))}
      </div>
    </div>
  );
}

function ReelCell({
  item,
  height,
  kind,
}: {
  item: SlotItem;
  height: number;
  kind: "color" | "plain";
}) {
  const { locale } = useI18n();
  const label =
    kind === "color"
      ? colorLabel(item.label, locale).toLocaleUpperCase(locale === "tr" ? "tr" : "nb")
      : item.label;

  if (kind === "color" && item.color) {
    const ink = ticketInk(item.color);
    return (
      <div className="flex items-center justify-center px-1" style={{ height }}>
        <div
          className="flex h-[78%] w-full items-center justify-center overflow-hidden rounded-sm"
          style={{ backgroundColor: item.color, color: ink }}
        >
          <span className="max-w-full truncate px-1.5 font-ticket text-lg tracking-wide sm:text-xl">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center px-1 font-ticket text-4xl tracking-tight text-stage-fg tabular-nums sm:text-5xl"
      style={{ height }}
    >
      {label}
    </div>
  );
}
