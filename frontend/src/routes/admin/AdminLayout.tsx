import {useEffect, useState} from "react"
import {NavLink, Outlet, useNavigate} from "react-router-dom"
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

function AdminLayout() {
    const now = useLiveClock()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["admin-session"]})
            navigate("/admin/login", {replace: true})
        },
    })

    const date = now.toLocaleDateString("de-AT", {weekday: "short", day: "2-digit", month: "2-digit", year: "numeric"})
    const time = now.toLocaleTimeString("de-AT", {hour: "2-digit", minute: "2-digit", second: "2-digit"})

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-[--color-surface] border-b border-[--color-border] px-4 py-3 flex items-center justify-between">
                <div>
                    <div className="text-lg font-semibold tabular-nums">{time}</div>
                    <div className="text-xs text-[--color-text-secondary]">{date}</div>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                >
                    Abmelden
                </Button>
            </header>

            <nav className="bg-[--color-surface] border-b border-[--color-border] px-4 flex gap-1">
                {[
                    {to: "/admin/timetable", label: "Tagesplan"},
                    {to: "/admin/checkins", label: "Check-Ins verwalten"},
                ].map(({to, label}) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({isActive}) =>
                            [
                                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                                isActive
                                    ? "border-[--color-primary] text-[--color-text]"
                                    : "border-transparent text-[--color-muted] hover:text-[--color-text]",
                            ].join(" ")
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
