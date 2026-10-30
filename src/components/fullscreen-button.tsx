import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

// Safari on iPad still only has the webkit-prefixed API.
type WebkitDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void>;
};
type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };

function fullscreenElement() {
  const doc = document as WebkitDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function canFullscreen() {
  const doc = document as WebkitDocument;
  return Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

async function toggleFullscreen() {
  const doc = document as WebkitDocument;
  try {
    if (fullscreenElement()) {
      await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
    } else {
      const root = document.documentElement as WebkitElement;
      await (root.requestFullscreen?.() ?? root.webkitRequestFullscreen?.());
    }
  } catch {
    /* refused by the browser, e.g. not from a click */
  }
}

/** Fullscreens the whole page, so the draw screen stays fullscreen too. Hidden where unsupported (iPhone). */
export function FullscreenButton({ tone = "paper" }: { tone?: "paper" | "stage" }) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setSupported(canFullscreen());
    const sync = () => setActive(Boolean(fullscreenElement()));
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  if (!supported) return null;
  const label = active ? t.exitFullscreen : t.fullscreen;
  const Icon = active ? Minimize : Maximize;

  if (tone === "stage") {
    return (
      <button
        type="button"
        onClick={toggleFullscreen}
        className="grid size-11 place-items-center rounded-md text-stage-muted hover:bg-stage-fg/10 hover:text-stage-fg"
        aria-label={label}
        title={label}
        aria-pressed={active}
      >
        <Icon className="size-5" />
      </button>
    );
  }

  return (
    <Button variant="secondary" size="sm" onClick={toggleFullscreen} aria-pressed={active}>
      <Icon className="size-4" />
      {label}
    </Button>
  );
}
