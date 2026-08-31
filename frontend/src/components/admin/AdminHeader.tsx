import {useEffect, useRef, useState} from "react"
import {Link, NavLink, useMatch, useSearchParams} from "react-router-dom"

function useLiveClock() {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])
    return now
}

function toIsoDate(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

function shiftDate(isoDate: string, days: number) {
    const d = new Date(isoDate + "T00:00:00")
    d.setDate(d.getDate() + days)
    return toIsoDate(d)
}

function formatDisplayDate(isoDate: string) {
    const d = new Date(isoDate + "T00:00:00")
    return d.toLocaleDateString("de-AT", {weekday: "short", day: "2-digit", month: "2-digit", year: "numeric"})
        .replace(/^(\w+)\./, "$1")
}

function TimetableDatePicker() {
    const [params, setParams] = useSearchParams()
    const inputRef = useRef<HTMLInputElement>(null)
    const today = toIsoDate(new Date())
    const selected = params.get("date") ?? today
    const isToday = selected === today

    const set = (date: string) => setParams(p => { p.set("date", date); return p }, {replace: true})

    return (
        <div className="flex items-center gap-1 text-sm">
            {!isToday && (
                <button
                    onClick={() => set(today)}
                    className="px-2 py-1 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
                >
                    Heute
                </button>
            )}
            <button
                onClick={() => set(shiftDate(selected, -1))}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-border transition-colors text-text-secondary hover:text-text"
                title="Vorheriger Tag"
            >‹</button>
            <button
                onClick={() => inputRef.current?.showPicker()}
                className="px-2 py-1 rounded hover:bg-border transition-colors text-text font-medium tabular-nums whitespace-nowrap"
                title="Datum wählen"
            >
                {formatDisplayDate(selected)}
                <input
                    ref={inputRef}
                    type="date"
                    value={selected}
                    onChange={e => e.target.value && set(e.target.value)}
                    className="sr-only"
                    tabIndex={-1}
                />
            </button>
            <button
                onClick={() => set(shiftDate(selected, 1))}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-border transition-colors text-text-secondary hover:text-text"
                title="Nächster Tag"
            >›</button>
        </div>
    )
}

function AdminHeader() {
    const now = useLiveClock()
    const onTimetable = useMatch("/admin/timetable")

    const time = now.toLocaleTimeString("de-AT", {hour: "2-digit", minute: "2-digit"})

    return (
        <header className="bg-surface border-b border-border">
            {/* Row 1: logo | time + (mobile: date picker) + QR */}
            <div className="px-4 py-1 flex items-center justify-between gap-4">
                <img src="/logo.png" alt="Logo" className="h-8 shrink-0 hidden md:block"/>
                <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold font-sans tabular-nums leading-none">{time}</div>
                    {onTimetable && (
                        <div className="md:hidden">
                            <TimetableDatePicker />
                        </div>
                    )}
                    <Link
                        to="/admin/qr"
                        className="p-1.5 rounded hover:bg-border transition-colors text-muted hover:text-text"
                        title="Check-In QR-Code"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                            <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zM14 3h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 14h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zM14 14h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2z"/>
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Row 2: nav + (desktop: date picker) */}
            <div className="flex items-center border-t border-border/40 overflow-x-auto">
                <nav className="flex shrink-0">
                    {[
                        {to: "/admin/timetable", label: "Timetable"},
                        {to: "/admin/registrations", label: "Registrierungen"},
                    ].map(({to, label}) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({isActive}) =>
                                [
                                    "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    isActive
                                        ? "border-primary text-text"
                                        : "border-transparent text-muted hover:text-text",
                                ].join(" ")
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
                {onTimetable && (
                    <div className="hidden md:block ml-auto px-3 shrink-0">
                        <TimetableDatePicker />
                    </div>
                )}
            </div>
        </header>
    )
}

export default AdminHeader
