import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, c as Monitor, d as ChevronUp, f as ChevronDown, l as ImagePlus, n as Undo2, o as RotateCcw, r as Trophy, s as Plus, t as X, u as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D0RqHfVu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-out select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg shadow-[var(--shadow-border)] hover:opacity-95",
			stage: "bg-stage-fg text-stage hover:opacity-95 font-display text-lg tracking-tight shadow-[var(--shadow-border)]",
			secondary: "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "bg-transparent text-fg hover:bg-bg-warm",
			danger: "bg-primary/10 text-primary hover:bg-primary/15"
		},
		size: {
			sm: "h-9 px-3 text-sm",
			md: "h-11 px-4 text-sm",
			lg: "h-12 min-h-12 px-6 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md bg-surface px-3 text-base text-fg shadow-[var(--shadow-border)]", "placeholder:text-subtle", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40", "disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium tracking-wide text-muted uppercase", className),
		...props
	});
}
var PALETTE = [
	{
		name: "Rød",
		hex: "#C62828",
		aliases: [
			"rod",
			"red",
			"rød"
		]
	},
	{
		name: "Blå",
		hex: "#1565C0",
		aliases: [
			"bla",
			"blå",
			"blue"
		]
	},
	{
		name: "Gul",
		hex: "#D4A017",
		aliases: [
			"gul",
			"yellow",
			"gull"
		]
	},
	{
		name: "Grønn",
		hex: "#2E7D32",
		aliases: [
			"gronn",
			"grønn",
			"green"
		]
	},
	{
		name: "Rosa",
		hex: "#C2185B",
		aliases: ["rosa", "pink"]
	},
	{
		name: "Oransje",
		hex: "#E65100",
		aliases: ["oransje", "orange"]
	},
	{
		name: "Turkis",
		hex: "#00838F",
		aliases: [
			"turkis",
			"cyan",
			"teal"
		]
	},
	{
		name: "Lilla",
		hex: "#5E35B1",
		aliases: [
			"lilla",
			"fiolett",
			"purple",
			"violet"
		]
	},
	{
		name: "Brun",
		hex: "#6D4C41",
		aliases: ["brun", "brown"]
	},
	{
		name: "Svart",
		hex: "#212121",
		aliases: ["svart", "black"]
	},
	{
		name: "Hvit",
		hex: "#F3EEE6",
		aliases: ["hvit", "white"]
	},
	{
		name: "Grå",
		hex: "#616161",
		aliases: [
			"gra",
			"grå",
			"gray",
			"grey"
		]
	}
];
function normalize(value) {
	return value.trim().toLowerCase().replaceAll("ø", "o").replaceAll("æ", "ae").replaceAll("å", "a");
}
function colorFromName(name) {
	const key = normalize(name);
	return PALETTE.find((c) => normalize(c.name) === key || c.aliases.some((a) => normalize(a) === key));
}
function hexForColorName(name, fallback = "#C62828") {
	return colorFromName(name)?.hex ?? fallback;
}
function parseHex(hex) {
	let h = hex.replace("#", "").trim();
	if (h.length === 3) h = h.split("").map((c) => c + c).join("");
	const n = Number.parseInt(h, 16);
	if (!Number.isFinite(n) || h.length !== 6) return {
		r: .2,
		g: .15,
		b: .12
	};
	return {
		r: (n >> 16 & 255) / 255,
		g: (n >> 8 & 255) / 255,
		b: (n & 255) / 255
	};
}
function isLightHex(hex) {
	const { r, g, b } = parseHex(hex);
	return .2126 * r + .7152 * g + .0722 * b > .62;
}
function ticketInk(hex) {
	return isLightHex(hex) ? "#1c1814" : "#faf6ef";
}
var sizes = {
	sm: "h-16 w-[7.5rem] text-[0.55rem]",
	md: "h-[5.5rem] w-[11.5rem] text-[0.7rem]",
	lg: "h-36 w-[18rem] text-sm",
	hero: "h-52 w-[min(100%,22rem)] text-base sm:h-56 sm:w-[24rem]"
};
function TicketCard({ colorName, colorHex, letter, number, size = "md", className, dimmed }) {
	const ink = ticketInk(colorHex);
	const num = typeof number === "number" ? String(number).padStart(3, "0") : number ?? "•••";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex overflow-hidden rounded-md select-none", sizes[size], dimmed && "opacity-50 grayscale-[0.2]", className),
		style: {
			backgroundColor: colorHex,
			color: ink,
			boxShadow: "var(--shadow-border)"
		},
		"aria-label": `${colorName} ${letter} ${num}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-[18%] shrink-0 flex-col items-center justify-center border-r border-dashed",
				style: {
					borderColor: `${ink}33`,
					background: `color-mix(in oklab, ${colorHex} 78%, #000 22%)`
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-ticket leading-none tracking-wide",
					style: { fontSize: size === "hero" ? "1.65rem" : size === "lg" ? "1.25rem" : "0.85rem" },
					children: letter
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col justify-between px-2.5 py-1.5 sm:px-3 sm:py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium tracking-wide uppercase opacity-90",
							children: colorName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-ticket tracking-wider opacity-70",
							children: "LODD"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-ticket leading-none tracking-tight tabular-nums",
						style: { fontSize: size === "hero" ? "4.25rem" : size === "lg" ? "2.75rem" : size === "md" ? "1.85rem" : "1.15rem" },
						children: num
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[0.65em] tracking-[0.18em] uppercase opacity-70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							colorName,
							" ",
							letter
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "basar" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-y-0 left-[18%] w-3 -translate-x-1/2",
				style: {
					backgroundImage: `radial-gradient(circle, var(--color-bg) 3px, transparent 3.5px)`,
					backgroundSize: "12px 11px",
					backgroundRepeat: "repeat-y",
					backgroundPosition: "center"
				}
			})
		]
	});
}
"ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ".split("");
var BOOK_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXY".split("");
function ticketKey(bookId, number) {
	return `${bookId}:${number}`;
}
function formatTicket(colorName, letter, number) {
	return `${colorName} ${letter} ${String(number).padStart(3, "0")}`;
}
function expandPool(books, drawnKeys) {
	const drawn = drawnKeys instanceof Set ? drawnKeys : new Set(drawnKeys);
	const pool = [];
	for (const book of books) for (let n = book.from; n <= book.to; n++) {
		const key = ticketKey(book.id, n);
		if (drawn.has(key)) continue;
		pool.push({
			key,
			bookId: book.id,
			colorName: book.colorName,
			colorHex: book.colorHex,
			letter: book.letter,
			number: n
		});
	}
	return pool;
}
function remainingInBook(book, drawnKeys) {
	const drawn = drawnKeys instanceof Set ? drawnKeys : new Set(drawnKeys);
	let count = 0;
	for (let n = book.from; n <= book.to; n++) if (!drawn.has(ticketKey(book.id, n))) count += 1;
	return count;
}
function bookSize(book) {
	return Math.max(0, book.to - book.from + 1);
}
/** Unbiased index in [0, length). */
function randomIndex(length) {
	if (length <= 0) return 0;
	const max = 4294967296;
	const limit = max - max % length;
	const buf = /* @__PURE__ */ new Uint32Array(1);
	let x = 0;
	do {
		crypto.getRandomValues(buf);
		x = buf[0];
	} while (x >= limit);
	return x % length;
}
function pickTicket(pool) {
	if (pool.length === 0) return null;
	return pool[randomIndex(pool.length)] ?? null;
}
function winnerFromTicket(ticket, prize) {
	return {
		id: crypto.randomUUID(),
		drawnAt: Date.now(),
		bookId: ticket.bookId,
		colorName: ticket.colorName,
		colorHex: ticket.colorHex,
		letter: ticket.letter,
		number: ticket.number,
		prizeName: prize?.name?.trim() || void 0,
		prizeImage: prize?.imageDataUrl || void 0
	};
}
function parseBookLine(line) {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith("#")) return null;
	const match = trimmed.match(/^(.+?)\s+(\S+)\s+(\d+)\s*[-–—to]+\s*(\d+)$/i);
	if (!match) return null;
	const colorName = match[1].trim();
	const letter = match[2].trim().toUpperCase();
	const from = Number(match[3]);
	const to = Number(match[4]);
	if (!colorName || !letter || from < 1 || to < from) return null;
	return {
		colorName,
		letter,
		from,
		to
	};
}
function parseBookLines(text) {
	return text.split(/\n+/).map(parseBookLine).filter((row) => row !== null);
}
function bookFromParsed(parsed) {
	const known = colorFromName(parsed.colorName);
	return {
		id: crypto.randomUUID(),
		colorName: known?.name ?? parsed.colorName,
		colorHex: known?.hex ?? hexForColorName(parsed.colorName),
		letter: parsed.letter,
		from: parsed.from,
		to: Math.min(parsed.to, 9999)
	};
}
var EXAMPLE_BOOKS = [
	{
		colorName: "Rød",
		colorHex: "#C62828",
		letter: "A",
		from: 1,
		to: 100
	},
	{
		colorName: "Blå",
		colorHex: "#1565C0",
		letter: "A",
		from: 1,
		to: 100
	},
	{
		colorName: "Gul",
		colorHex: "#D4A017",
		letter: "A",
		from: 1,
		to: 100
	},
	{
		colorName: "Grønn",
		colorHex: "#2E7D32",
		letter: "A",
		from: 1,
		to: 100
	}
];
var initial = {
	eventName: "Loddtrekning",
	books: [],
	prizes: [],
	winners: [],
	drawnKeys: [],
	stageMode: false
};
var useRaffleStore = create()(persist((set, get) => ({
	...initial,
	setEventName: (eventName) => set({ eventName }),
	addBook: (book) => {
		const id = book.id ?? crypto.randomUUID();
		set((s) => ({ books: [...s.books, {
			...book,
			id
		}] }));
		return id;
	},
	addBooks: (books) => set((s) => ({ books: [...s.books, ...books.map((b) => ({
		...b,
		id: crypto.randomUUID()
	}))] })),
	removeBook: (id) => set((s) => ({
		books: s.books.filter((b) => b.id !== id),
		drawnKeys: s.drawnKeys.filter((k) => !k.startsWith(`${id}:`))
	})),
	addPrize: (prize) => set((s) => ({ prizes: [...s.prizes, {
		...prize,
		id: prize.id ?? crypto.randomUUID()
	}] })),
	removePrize: (id) => set((s) => ({ prizes: s.prizes.filter((p) => p.id !== id) })),
	movePrize: (id, dir) => set((s) => {
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
		const { books, drawnKeys, prizes } = get();
		if (books.length === 0) return {
			ok: false,
			reason: "empty"
		};
		const pool = expandPool(books, drawnKeys);
		const ticket = pickTicket(pool);
		if (!ticket) return {
			ok: false,
			reason: "none"
		};
		const [prize, ...rest] = prizes;
		const winner = winnerFromTicket(ticket, prize);
		set((s) => ({
			winners: [winner, ...s.winners],
			drawnKeys: [...s.drawnKeys, ticket.key],
			prizes: rest
		}));
		return {
			ok: true,
			winner,
			remaining: pool.length - 1
		};
	},
	undoLast: () => set((s) => {
		const [last, ...rest] = s.winners;
		if (!last) return s;
		const key = ticketKey(last.bookId, last.number);
		const restoredPrize = last.prizeName ? {
			id: crypto.randomUUID(),
			name: last.prizeName,
			imageDataUrl: last.prizeImage
		} : null;
		return {
			winners: rest,
			drawnKeys: s.drawnKeys.filter((k) => k !== key),
			prizes: restoredPrize ? [restoredPrize, ...s.prizes] : s.prizes
		};
	}),
	newRound: () => set({
		winners: [],
		drawnKeys: []
	}),
	resetAll: () => set({
		...initial,
		eventName: get().eventName
	}),
	loadExample: () => set((s) => ({ books: s.books.length === 0 ? EXAMPLE_BOOKS.map((b) => ({
		...b,
		id: crypto.randomUUID()
	})) : s.books })),
	setStageMode: (stageMode) => set({ stageMode })
}), {
	name: "lodd-raffle-v1",
	skipHydration: true,
	partialize: (s) => ({
		eventName: s.eventName,
		books: s.books,
		prizes: s.prizes,
		winners: s.winners,
		drawnKeys: s.drawnKeys,
		stageMode: s.stageMode
	})
}));
function AddBookForm() {
	const addBook = useRaffleStore((s) => s.addBook);
	const addBooks = useRaffleStore((s) => s.addBooks);
	const [colorName, setColorName] = (0, import_react.useState)("Rød");
	const [colorHex, setColorHex] = (0, import_react.useState)("#C62828");
	const [letter, setLetter] = (0, import_react.useState)("A");
	const [from, setFrom] = (0, import_react.useState)(1);
	const [to, setTo] = (0, import_react.useState)(100);
	const [bulk, setBulk] = (0, import_react.useState)("");
	const [showBulk, setShowBulk] = (0, import_react.useState)(false);
	const previewHex = colorHex || hexForColorName(colorName);
	const bulkCount = (0, import_react.useMemo)(() => parseBookLines(bulk).length, [bulk]);
	function onColorChip(name, hex) {
		setColorName(name);
		setColorHex(hex);
	}
	function onColorNameChange(value) {
		setColorName(value);
		const known = colorFromName(value);
		if (known) setColorHex(known.hex);
	}
	function submitBook() {
		const name = colorName.trim();
		const lettr = letter.trim().toUpperCase();
		if (!name || !lettr) {
			toast.error("Farge og bokstav må fylles ut");
			return;
		}
		if (from < 1 || to < from || to > 9999) {
			toast.error("Ugyldig nummerområde");
			return;
		}
		addBook({
			colorName: name,
			colorHex: previewHex,
			letter: lettr,
			from,
			to
		});
		toast.success(`La til ${name} ${lettr} ${from}–${to}`);
	}
	function submitBulk() {
		const parsed = parseBookLines(bulk);
		if (parsed.length === 0) {
			toast.error("Fant ingen gyldige linjer. Format: Rød A 1–100");
			return;
		}
		addBooks(parsed.map(bookFromParsed));
		setBulk("");
		setShowBulk(false);
		toast.success(`La til ${parsed.length} loddbok${parsed.length === 1 ? "" : "er"}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl tracking-tight",
				children: "Loddbøker"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Farge, bokstav og solgte nummer (1–100)."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-muted underline-offset-2 hover:text-fg hover:underline",
				onClick: () => setShowBulk((v) => !v),
				children: showBulk ? "Skjema" : "Hurtiginnlegging"
			})]
		}), showBulk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "bulk",
					children: "Én bok per linje"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "bulk",
					value: bulk,
					onChange: (e) => setBulk(e.target.value),
					rows: 6,
					placeholder: "Rød A 1-100\nBlå L 1-59\nGul B 20-100",
					className: "w-full resize-y rounded-md bg-bg px-3 py-2 font-mono text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: submitBulk,
					disabled: bulkCount === 0,
					children: [
						"Legg til ",
						bulkCount || "",
						" ",
						bulkCount === 1 ? "bok" : "bøker"
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Farge" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: PALETTE.map((c) => {
								const active = colorName.toLowerCase() === c.name.toLowerCase();
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onColorChip(c.name, c.hex),
									className: cn("flex h-9 items-center gap-2 rounded-sm px-2.5 text-sm", "shadow-[var(--shadow-border)]", active ? "ring-2 ring-fg/70" : "hover:shadow-[var(--shadow-border-hover)]"),
									style: {
										background: c.hex,
										color: c.name === "Hvit" || c.name === "Gul" ? "#1c1814" : "#faf6ef"
									},
									children: c.name
								}, c.name);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 grid grid-cols-[1fr_auto] gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: colorName,
								onChange: (e) => onColorNameChange(e.target.value),
								placeholder: "Fargenavn",
								"aria-label": "Fargenavn"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "relative size-11 overflow-hidden rounded-md shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Velg farge"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: previewHex,
									onChange: (e) => setColorHex(e.target.value),
									className: "absolute inset-0 size-full cursor-pointer border-0 p-0"
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bokstav" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: BOOK_LETTERS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLetter(l),
								className: cn("grid size-9 place-items-center rounded-sm font-ticket text-sm shadow-[var(--shadow-border)]", letter === l ? "bg-fg text-bg" : "bg-surface text-fg hover:bg-bg-warm"),
								children: l
							}, l))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: letter,
							maxLength: 8,
							onChange: (e) => setLetter(e.target.value.toUpperCase()),
							"aria-label": "Bokstav",
							className: "max-w-32 font-ticket tracking-wider"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "from",
							children: "Fra nummer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "from",
							type: "number",
							min: 1,
							max: 9999,
							value: from,
							onChange: (e) => setFrom(Number(e.target.value))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "to",
							children: "Til nummer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "to",
							type: "number",
							min: 1,
							max: 9999,
							value: to,
							onChange: (e) => setTo(Number(e.target.value))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						[1, 50],
						[1, 100],
						[1, 200]
					].map(([a, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setFrom(a);
							setTo(b);
						},
						className: "h-8 rounded-sm bg-bg-warm px-2.5 text-xs text-muted hover:text-fg",
						children: [
							a,
							"–",
							b
						]
					}, `${a}-${b}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
						colorName: colorName || "Farge",
						colorHex: previewHex,
						letter: letter || "?",
						number: from,
						size: "md"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: submitBook,
						className: "min-w-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Legg til bok"]
					})]
				})
			]
		})]
	});
}
function AppHeader() {
	const eventName = useRaffleStore((s) => s.eventName);
	const setEventName = useRaffleStore((s) => s.setEventName);
	const books = useRaffleStore((s) => s.books);
	const drawnKeys = useRaffleStore((s) => s.drawnKeys);
	const winners = useRaffleStore((s) => s.winners);
	const undoLast = useRaffleStore((s) => s.undoLast);
	const newRound = useRaffleStore((s) => s.newRound);
	const resetAll = useRaffleStore((s) => s.resetAll);
	const stageMode = useRaffleStore((s) => s.stageMode);
	const setStageMode = useRaffleStore((s) => s.setStageMode);
	const remaining = expandPool(books, drawnKeys).length;
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "Basar · lotteri"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight sm:text-4xl",
						children: "Lodd"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: eventName,
						onChange: (e) => setEventName(e.target.value),
						"aria-label": "Navn på trekningen",
						className: "h-10 max-w-64 bg-transparent shadow-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted tabular-nums",
					children: [
						remaining,
						" lodd igjen",
						winners.length ? ` · ${winners.length} trukket` : "",
						books.length ? ` · ${books.length} bøker` : ""
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: () => setStageMode(!stageMode),
					"aria-pressed": stageMode,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-4" }), "Storskjerm"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					disabled: winners.length === 0,
					onClick: () => {
						undoLast();
						toast("Siste trekk angret");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" }), "Angre"]
				}),
				confirm === "round" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					size: "sm",
					onClick: () => {
						newRound();
						setConfirm(null);
						toast("Ny runde — samme bøker, tom vinnerliste");
					},
					children: "Bekreft ny runde"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setConfirm(null),
					children: "Avbryt"
				})] }) : confirm === "reset" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					size: "sm",
					onClick: () => {
						resetAll();
						setConfirm(null);
						toast("Alt er tømt");
					},
					children: "Bekreft tømming"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setConfirm(null),
					children: "Avbryt"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setConfirm("round"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Ny runde"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "text-muted",
					onClick: () => setConfirm("reset"),
					children: "Tøm alt"
				})] })
			]
		})]
	});
}
function BookList() {
	const books = useRaffleStore((s) => s.books);
	const drawnKeys = useRaffleStore((s) => s.drawnKeys);
	const removeBook = useRaffleStore((s) => s.removeBook);
	if (books.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-1 text-sm text-muted",
		children: "Ingen loddbøker ennå. Legg inn farge, bokstav og nummerområde for bøkene dere har solgt."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-2",
		children: books.map((book) => {
			const left = remainingInBook(book, drawnKeys);
			const total = bookSize(book);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 rounded-lg bg-surface p-2 pl-2.5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
						colorName: book.colorName,
						colorHex: book.colorHex,
						letter: book.letter,
						number: book.from,
						size: "sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate font-medium",
							children: [
								book.colorName,
								" ",
								book.letter
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted tabular-nums",
							children: [
								book.from,
								"–",
								book.to,
								" · ",
								left,
								" av ",
								total,
								" igjen"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => removeBook(book.id),
						className: "grid size-11 place-items-center rounded-md text-muted hover:bg-bg-warm hover:text-primary",
						"aria-label": `Fjern ${book.colorName} ${book.letter}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}, book.id);
		})
	});
}
function ConfettiCanvas({ active, colors }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let raf = 0;
		let running = true;
		const palette = colors.length ? colors : [
			"#C62828",
			"#1565C0",
			"#D4A017",
			"#2E7D32",
			"#f4efe6"
		];
		const resize = () => {
			canvas.width = canvas.clientWidth * devicePixelRatio;
			canvas.height = canvas.clientHeight * devicePixelRatio;
			ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
		};
		resize();
		const w = () => canvas.clientWidth;
		const h = () => canvas.clientHeight;
		const particles = Array.from({ length: 140 }, (_, i) => ({
			x: w() * .5 + (Math.random() - .5) * w() * .35,
			y: h() * .32 + (Math.random() - .5) * 40,
			vx: (Math.random() - .5) * 14,
			vy: -4 - Math.random() * 10,
			rot: Math.random() * Math.PI * 2,
			vr: (Math.random() - .5) * .28,
			w: 6 + Math.random() * 9,
			h: 4 + Math.random() * 7,
			color: palette[i % palette.length],
			life: 1
		}));
		const gravity = .18;
		const start = performance.now();
		const frame = (now) => {
			if (!running) return;
			const elapsed = now - start;
			ctx.clearRect(0, 0, w(), h());
			for (const p of particles) {
				p.vy += gravity;
				p.x += p.vx;
				p.y += p.vy;
				p.rot += p.vr;
				p.life = Math.max(0, 1 - elapsed / 4200);
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				ctx.globalAlpha = p.life;
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
				ctx.restore();
			}
			if (elapsed < 4300) raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
		const onResize = () => resize();
		window.addEventListener("resize", onResize);
		return () => {
			running = false;
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", onResize);
		};
	}, [active, colors]);
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "pointer-events-none absolute inset-0 z-20 size-full",
		"aria-hidden": true
	});
}
function Reel({ items, itemHeight, className, variant }) {
	const [offset, setOffset] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setOffset((items.length - 1) * itemHeight);
			});
		});
		return () => cancelAnimationFrame(id);
	}, [items.length, itemHeight]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-hidden rounded-md bg-stage-fg/5",
		style: { height: itemHeight },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("reel-spin will-change-transform", variant === "letter" && "delay-letter", variant === "number" && "delay-number"),
			style: { transform: `translateY(-${offset}px)` },
			children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex items-center justify-center font-ticket tracking-tight text-stage-fg", className),
				style: { height: itemHeight },
				children: item
			}, `${item}-${i}`))
		})
	});
}
function buildStrip(options, winner, spins) {
	const pool = options.length ? options : [winner];
	const strip = [];
	for (let s = 0; s < spins; s++) for (let i = 0; i < pool.length; i++) strip.push(pool[(i + s) % pool.length]);
	if (strip[strip.length - 1] === winner) strip.push(pool[0] ?? winner);
	strip.push(winner);
	return strip;
}
function DrawOverlay({ winner, remaining, onClose, onDrawAgain }) {
	const books = useRaffleStore((s) => s.books);
	const drawnKeys = useRaffleStore((s) => s.drawnKeys);
	const [phase, setPhase] = (0, import_react.useState)("spin");
	const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const samples = (0, import_react.useMemo)(() => {
		const pool = expandPool(books, drawnKeys);
		if (pool.length === 0) return books.slice(0, 12).map((b, i) => ({
			key: `${b.id}-s${i}`,
			colorName: b.colorName,
			colorHex: b.colorHex,
			letter: b.letter,
			number: b.from + i % Math.max(1, b.to - b.from + 1)
		}));
		const out = [];
		const n = Math.min(14, Math.max(8, pool.length));
		for (let i = 0; i < n; i++) {
			const t = pool[i % pool.length];
			out.push(t);
		}
		return out;
	}, [books, drawnKeys]);
	const colorOpts = (0, import_react.useMemo)(() => Array.from(new Set(books.map((b) => b.colorName.toUpperCase()))), [books]);
	const letterOpts = (0, import_react.useMemo)(() => Array.from(new Set(books.map((b) => b.letter.toUpperCase()))), [books]);
	const numberOpts = (0, import_react.useMemo)(() => {
		const nums = [];
		for (let i = 0; i < 18; i++) {
			const n = 1 + (winner.number * 7 + i * 13) % 100;
			nums.push(String(n).padStart(3, "0"));
		}
		return nums;
	}, [winner.number]);
	const colorStrip = (0, import_react.useMemo)(() => buildStrip(colorOpts, winner.colorName.toUpperCase(), 3), [colorOpts, winner.colorName]);
	const letterStrip = (0, import_react.useMemo)(() => buildStrip(letterOpts, winner.letter.toUpperCase(), 4), [letterOpts, winner.letter]);
	const numberStrip = (0, import_react.useMemo)(() => buildStrip(numberOpts, String(winner.number).padStart(3, "0"), 3), [numberOpts, winner.number]);
	const confettiColors = (0, import_react.useMemo)(() => [.../* @__PURE__ */ new Set([
		...books.map((b) => b.colorHex),
		winner.colorHex,
		"#f4efe6",
		"#9f1d2c"
	])], [books, winner.colorHex]);
	(0, import_react.useEffect)(() => {
		if (reduced) {
			setPhase("reveal");
			return;
		}
		const t = window.setTimeout(() => setPhase("reveal"), 3300);
		return () => window.clearTimeout(t);
	}, [reduced, winner.id]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape" && phase === "reveal") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose, phase]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-stage text-stage-fg",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Loddtrekning",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				style: { background: "radial-gradient(ellipse 70% 55% at 50% 42%, rgb(244 239 230 / 0.08), transparent 62%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfettiCanvas, {
				active: phase === "reveal",
				colors: confettiColors
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center justify-between px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm tracking-wide text-stage-muted uppercase",
					children: "Loddtrekning"
				}), phase === "reveal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "h-11 px-3 text-sm text-stage-muted hover:text-stage-fg",
					children: "Lukk"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-stage-muted",
					children: "Trekker blant gjenværende lodd…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-8",
				children: phase === "spin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-10 grid size-[18rem] place-items-center sm:size-[22rem]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "orbit-spin absolute inset-0",
						children: samples.map((t, i) => {
							const angle = 360 / samples.length * i;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-1/2 left-1/2",
								style: { transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-7.2rem) rotate(${-angle}deg)` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
									colorName: t.colorName,
									colorHex: t.colorHex,
									letter: t.letter,
									number: t.number,
									size: "sm",
									className: "scale-90 opacity-80"
								})
							}, t.key);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg text-stage-muted",
						children: "Tombola"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid w-full max-w-lg grid-cols-3 gap-2 rounded-xl bg-stage-fg/10 p-3 sm:gap-3 sm:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1.5 text-center text-[0.65rem] tracking-[0.18em] text-stage-muted uppercase",
							children: "Farge"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reel, {
							items: colorStrip,
							itemHeight: 72,
							variant: "color",
							className: "text-2xl sm:text-3xl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1.5 text-center text-[0.65rem] tracking-[0.18em] text-stage-muted uppercase",
							children: "Bokstav"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reel, {
							items: letterStrip,
							itemHeight: 72,
							variant: "letter",
							className: "text-4xl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1.5 text-center text-[0.65rem] tracking-[0.18em] text-stage-muted uppercase",
							children: "Nummer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reel, {
							items: numberStrip,
							itemHeight: 72,
							variant: "number",
							className: "text-4xl tabular-nums"
						})] })
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-lg flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rise-in text-sm tracking-[0.2em] text-stage-muted uppercase",
							children: "Vinneren er"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ticket-pop mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
								colorName: winner.colorName,
								colorHex: winner.colorHex,
								letter: winner.letter,
								number: winner.number,
								size: "hero"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "rise-in stagger-2 mt-6 font-display text-3xl tracking-tight sm:text-4xl",
							children: [
								winner.colorName,
								" ",
								winner.letter,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: String(winner.number).padStart(3, "0")
								})
							]
						}),
						winner.prizeName || winner.prizeImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rise-in stagger-3 mt-5 flex items-center gap-3 rounded-lg bg-stage-fg/10 px-4 py-3",
							children: [winner.prizeImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: winner.prizeImage,
								alt: "",
								className: "size-16 rounded-md object-cover"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs tracking-wide text-stage-muted uppercase",
									children: "Premie"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: winner.prizeName ?? "Premie"
								})]
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-stage-muted tabular-nums",
							children: [remaining, " lodd igjen i puljen"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex w-full flex-col gap-2 sm:flex-row sm:justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "stage",
								size: "lg",
								onClick: onDrawAgain,
								disabled: remaining === 0,
								children: "Trekk neste"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "lg",
								className: "text-stage-fg hover:bg-stage-fg/10",
								onClick: onClose,
								children: "Ferdig"
							})]
						})
					]
				})
			})
		]
	});
}
function DrawStage() {
	const books = useRaffleStore((s) => s.books);
	const drawnKeys = useRaffleStore((s) => s.drawnKeys);
	const prizes = useRaffleStore((s) => s.prizes);
	const winners = useRaffleStore((s) => s.winners);
	const draw = useRaffleStore((s) => s.draw);
	const remaining = expandPool(books, drawnKeys).length;
	const last = winners[0];
	const nextPrize = prizes[0];
	const [live, setLive] = (0, import_react.useState)(null);
	function runDraw() {
		const result = draw();
		if (!result.ok) {
			toast.error(result.reason === "empty" ? "Legg til loddbøker først" : "Ingen lodd igjen å trekke");
			return;
		}
		setLive({
			winner: result.winner,
			remaining: result.remaining
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden rounded-xl bg-stage px-4 py-8 text-stage-fg shadow-[var(--shadow-border)] sm:px-8 sm:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0",
			style: { background: "radial-gradient(ellipse 80% 70% at 50% 40%, rgb(244 239 230 / 0.07), transparent 60%)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-stage-muted uppercase",
					children: "Neste trekk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl tracking-tight sm:text-4xl",
					children: "Trekk vinner"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-md text-sm text-stage-muted",
					children: [
						"Blant ",
						remaining,
						" solgte lodd. Trukne lodd huskes og kommer ikke opp igjen."
					]
				}),
				nextPrize ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center gap-3 rounded-lg bg-stage-fg/10 px-3 py-2 text-left",
					children: [nextPrize.imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: nextPrize.imageDataUrl,
						alt: "",
						className: "size-12 rounded-md object-cover"
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.65rem] tracking-wide text-stage-muted uppercase",
						children: "Premie i kø"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: nextPrize.name
					})] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-stage-muted",
					children: "Ingen premie i kø — du kan likevel trekke lodd."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "stage",
					size: "lg",
					className: "mt-8 min-h-14 min-w-52 px-10 text-xl",
					onClick: runDraw,
					disabled: remaining === 0,
					children: "Trekk vinner"
				}),
				last && !live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs tracking-[0.18em] text-stage-muted uppercase",
							children: "Sist trukket"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
							colorName: last.colorName,
							colorHex: last.colorHex,
							letter: last.letter,
							number: last.number,
							size: "lg"
						}),
						last.prizeName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-stage-muted",
							children: last.prizeName
						}) : null
					]
				}) : remaining === 0 && books.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-stage-muted",
					children: "Alle lodd er trukket. Start ny runde for å trekke på nytt."
				}) : null
			]
		})]
	}), live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawOverlay, {
		winner: live.winner,
		remaining: live.remaining,
		onClose: () => setLive(null),
		onDrawAgain: () => {
			setLive(null);
			window.setTimeout(runDraw, 40);
		}
	}) : null] });
}
async function resizeImageFile(file, maxSize = 720) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Kunne ikke lese bildet");
	ctx.fillStyle = "#f4efe6";
	ctx.fillRect(0, 0, width, height);
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	return canvas.toDataURL("image/jpeg", .74);
}
function PrizeQueue() {
	const prizes = useRaffleStore((s) => s.prizes);
	const addPrize = useRaffleStore((s) => s.addPrize);
	const removePrize = useRaffleStore((s) => s.removePrize);
	const movePrize = useRaffleStore((s) => s.movePrize);
	const [name, setName] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)();
	const fileRef = (0, import_react.useRef)(null);
	async function onFile(file) {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Velg et bilde");
			return;
		}
		try {
			const data = await resizeImageFile(file);
			setImage(data);
		} catch {
			toast.error("Kunne ikke lese bildet");
		}
	}
	function submit() {
		const trimmed = name.trim();
		if (!trimmed && !image) {
			toast.error("Skriv premienavn eller last opp bilde");
			return;
		}
		addPrize({
			name: trimmed || "Premie",
			imageDataUrl: image
		});
		setName("");
		setImage(void 0);
		if (fileRef.current) fileRef.current.value = "";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl tracking-tight",
				children: "Premier"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-muted",
				children: "Valgfritt. Neste premie i køen brukes automatisk ved trekning."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "prize-name",
						children: "Premie"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "prize-name",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "f.eks. Marsipankake",
						onKeyDown: (e) => {
							if (e.key === "Enter") submit();
						}
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "sr-only",
							onChange: (e) => void onFile(e.target.files?.[0])
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => fileRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), image ? "Bytt bilde" : "Bilde av premie"]
						}),
						image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: image,
							alt: "",
							className: "size-14 rounded-md object-cover"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: submit,
							className: "ml-auto",
							children: "Legg i kø"
						})
					]
				})]
			}),
			prizes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 grid gap-2",
				children: prizes.map((prize, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-lg bg-bg p-2 shadow-[var(--shadow-border)]",
					children: [
						prize.imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: prize.imageDataUrl,
							alt: "",
							className: "size-12 rounded-sm object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-12 place-items-center rounded-sm bg-bg-warm font-ticket text-muted",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: ["Premie ", i + 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: prize.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-10 place-items-center text-muted hover:text-fg disabled:opacity-30",
									disabled: i === 0,
									onClick: () => movePrize(prize.id, -1),
									"aria-label": "Flytt opp",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-10 place-items-center text-muted hover:text-fg disabled:opacity-30",
									disabled: i === prizes.length - 1,
									onClick: () => movePrize(prize.id, 1),
									"aria-label": "Flytt ned",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-10 place-items-center text-muted hover:text-primary",
									onClick: () => removePrize(prize.id),
									"aria-label": "Fjern premie",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							]
						})
					]
				}, prize.id))
			}) : null
		]
	});
}
function StageMode() {
	const setStageMode = useRaffleStore((s) => s.setStageMode);
	const winners = useRaffleStore((s) => s.winners);
	const eventName = useRaffleStore((s) => s.eventName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-stage text-stage-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-stage-muted uppercase",
					children: "Lodd"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl tracking-tight",
					children: eventName
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setStageMode(false),
					className: "inline-flex h-11 items-center gap-2 px-3 text-sm text-stage-muted hover:text-stage-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), "Avslutt storskjerm"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 flex-col justify-center px-4 pb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawStage, {})
			}),
			winners.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-3 overflow-x-auto px-4 pb-5",
				children: winners.slice(0, 8).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					colorName: w.colorName,
					colorHex: w.colorHex,
					letter: w.letter,
					number: w.number,
					size: "sm"
				}, w.id))
			}) : null
		]
	});
}
function escapeHtml(value) {
	const amp = "&";
	return value.replaceAll("&", `${amp}amp;`).replaceAll("<", `${amp}lt;`).replaceAll(">", `${amp}gt;`).replaceAll("\"", `${amp}quot;`);
}
function openWinnersPrint(state) {
	const when = (/* @__PURE__ */ new Date()).toLocaleDateString("nb-NO", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
	const rows = [...state.winners].reverse();
	const body = rows.map((w, i) => {
		const img = w.prizeImage ? `<img class="prize" src="${w.prizeImage}" alt="" />` : "";
		return `<tr>
        <td class="nr">${i + 1}</td>
        <td>
          <span class="swatch" style="background:${escapeHtml(w.colorHex)}"></span>
          <strong>${escapeHtml(formatTicket(w.colorName, w.letter, w.number))}</strong>
        </td>
        <td>${escapeHtml(w.prizeName ?? "—")}${img}</td>
        <td class="time">${new Date(w.drawnAt).toLocaleTimeString("nb-NO", {
			hour: "2-digit",
			minute: "2-digit"
		})}</td>
      </tr>`;
	}).join("");
	const html = `<!doctype html>
<html lang="nb">
<head>
  <meta charset="utf-8" />
  <title>Vinnere — ${escapeHtml(state.eventName)}</title>
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
    <button onclick="window.print()">Lagre som PDF</button>
    <button class="ghost" onclick="window.close()">Lukk</button>
  </div>
  <h1>${escapeHtml(state.eventName)}</h1>
  <p class="meta">Vinnerliste · ${escapeHtml(when)} · ${rows.length} vinner${rows.length === 1 ? "" : "e"}</p>
  <table>
    <thead>
      <tr><th>#</th><th>Lodd</th><th>Premie</th><th>Tid</th></tr>
    </thead>
    <tbody>
      ${body || `<tr><td colspan="4">Ingen vinnere ennå.</td></tr>`}
    </tbody>
  </table>
  <p class="foot">Generert med Lodd. Hvert lodd trekkes bare én gang.</p>
  <script>window.addEventListener("load", () => setTimeout(() => window.print(), 250));<\/script>
</body>
</html>`;
	const win = window.open("", "_blank", "noopener,width=900,height=1200");
	if (!win) return false;
	win.document.open();
	win.document.write(html);
	win.document.close();
	return true;
}
function WinnersPanel() {
	const winners = useRaffleStore((s) => s.winners);
	const eventName = useRaffleStore((s) => s.eventName);
	function exportPdf() {
		if (!openWinnersPrint({
			eventName,
			winners
		})) toast.error("Tillat sprettoppvindu for å eksportere PDF");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl tracking-tight",
				children: "Vinnere"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: winners.length === 0 ? "Trukne lodd vises her og trekkes ikke igjen." : `${winners.length} trukket`
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				onClick: exportPdf,
				disabled: winners.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Eksporter PDF"]
			})]
		}), winners.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2 py-10 text-center text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-8 opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "Ingen vinnere ennå. Trykk Trekk vinner når bøkene er klare."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid gap-2",
			children: winners.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 rounded-lg bg-bg p-2 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 shrink-0 place-items-center font-ticket text-muted tabular-nums",
						children: winners.length - i
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
						colorName: w.colorName,
						colorHex: w.colorHex,
						letter: w.letter,
						number: w.number,
						size: "sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate font-medium",
							children: [
								w.colorName,
								" ",
								w.letter,
								" ",
								String(w.number).padStart(3, "0")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted",
							children: [
								w.prizeName ?? "Uten premienavn",
								" ·",
								" ",
								new Date(w.drawnAt).toLocaleTimeString("nb-NO", {
									hour: "2-digit",
									minute: "2-digit"
								})
							]
						})]
					}),
					w.prizeImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: w.prizeImage,
						alt: "",
						className: "size-12 rounded-sm object-cover"
					}) : null
				]
			}, w.id))
		})]
	});
}
function useHydrated() {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		Promise.resolve(useRaffleStore.persist.rehydrate()).then(() => {
			if (active) setHydrated(true);
		});
		return () => {
			active = false;
		};
	}, []);
	return hydrated;
}
function Home() {
	const hydrated = useHydrated();
	const stageMode = useRaffleStore((s) => s.stageMode);
	const books = useRaffleStore((s) => s.books);
	const addBooks = useRaffleStore((s) => s.addBooks);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Laster trekningen…"
		})
	});
	if (stageMode) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageMode, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-4 py-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyIntro, { onExample: () => addBooks(EXAMPLE_BOOKS.map((b) => ({ ...b }))) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBookForm, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookList, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeQueue, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawStage, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinnersPanel, {})]
				})]
			})
		]
	});
}
function EmptyIntro({ onExample }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 lg:flex-row lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight sm:text-3xl",
						children: "Trekk lodd slik det gjøres på basaren"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-muted",
						children: "Legg inn loddbøkene med farge, bokstav og nummer 1–100. Hvert trekk er tilfeldig blant solgte lodd, og det samme loddet trekkes aldri to ganger. Valgfritt bilde av premien, vinnerliste og PDF."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: onExample,
							children: "Fyll med eksempelbøker"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "self-center text-sm text-muted",
							children: "Rød, blå, gul og grønn A 1–100"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex -space-x-8 sm:-space-x-10",
				children: EXAMPLE_BOOKS.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: { transform: `rotate(${(i - 1.5) * 6}deg)` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
						colorName: b.colorName,
						colorHex: b.colorHex,
						letter: b.letter,
						number: 17 + i * 11,
						size: "md"
					})
				}, b.colorName))
			})]
		})
	});
}
//#endregion
export { Home as component };
