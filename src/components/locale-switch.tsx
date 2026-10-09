import { useI18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ tone = "paper" }: { tone?: "paper" | "stage" }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex rounded-md p-0.5",
        tone === "paper" ? "bg-bg-warm" : "bg-stage-fg/10",
      )}
      role="group"
      aria-label={t.language}
    >
      {(["nb", "tr"] as const satisfies readonly Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
          className={cn(
            "h-9 rounded-sm px-2.5 text-xs font-medium",
            locale === code
              ? tone === "paper"
                ? "bg-surface text-fg shadow-[var(--shadow-border)]"
                : "bg-stage-fg text-stage"
              : tone === "paper"
                ? "text-muted"
                : "text-stage-muted",
          )}
        >
          {code === "nb" ? "NO" : "TR"}
        </button>
      ))}
    </div>
  );
}
