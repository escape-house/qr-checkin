import {useEffect, useRef, useState} from "react"
import {NavLink, Outlet, useMatch, useNavigate, useSearchParams} from "react-router-dom"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {logout} from "../../api/adminApi.ts"
import {Button} from "../../components/ui/Button.tsx"

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
                    className="ml-1 px-2 py-1 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
                >
                    Heute
                </button>
            )}
            <button
                onClick={() => set(shiftDate(selected, -1))}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-border transition-colors text-text-secondary hover:text-text"
                title="Vorheriger Tag"
            >
                ‹
            </button>

            <button
                onClick={() => inputRef.current?.showPicker()}
                className="px-2 py-1 rounded hover:bg-border transition-colors text-text font-medium tabular-nums"
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
            >
                ›
            </button>

        </div>
    )
}

function AdminLayout() {
    const now = useLiveClock()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const onTimetable = useMatch("/admin/timetable")

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["admin-session"]})
            navigate("/admin/login", {replace: true})
        },
    })

    const time = now.toLocaleTimeString("de-AT", {hour: "2-digit", minute: "2-digit"})

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-surface border-b border-border px-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Logo" className="h-8"/>
                    <nav className="flex gap-1">
                        {[
                            {to: "/admin/timetable", label: "Timetable"},
                            {to: "/admin/registrations", label: "Registrierungen verwalten"},
                        ].map(({to, label}) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({isActive}) =>
                                    [
                                        "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
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
                </div>

                <div className="flex items-center gap-4 py-2">
                    {onTimetable && <TimetableDatePicker />}
                    <div className="text-2xl font-semibold tabular-nums leading-none">{time}</div>
                </div>
            </header>

            <main className="flex-1 p-4">
                <Outlet/>
            </main>
            <footer className="flex justify-end bg-surface">
                <Button
                    variant="ghost"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="text-text"
                >
                    Abmelden
                </Button>
            </footer>
        </div>
    )
}

export default AdminLayout
