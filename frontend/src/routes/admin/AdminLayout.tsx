import {useEffect, useState} from "react"
import {Outlet, useNavigate} from "react-router-dom"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import AdminHeader from "../../components/admin/AdminHeader.tsx"
import {AdminFooter} from "../../components/admin/AdminFooter.tsx"
import {logout} from "../../api/adminApi.ts"

function AdminLayout() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [theme, setTheme] = useState<"dark" | "light">(() =>
        (localStorage.getItem("admin-theme") as "dark" | "light") ?? "dark"
    )

    useEffect(() => {
        const html = document.documentElement
        html.classList.toggle("admin-light", theme === "light")
        return () => html.classList.remove("admin-light")
    }, [theme])

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["admin-session"]})
            navigate("/admin/login", {replace: true})
        },
    })

    function toggleTheme() {
        setTheme(t => {
            const next = t === "dark" ? "light" : "dark"
            localStorage.setItem("admin-theme", next)
            return next
        })
    }

    return (
        <div className="min-h-screen flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-3 py-1">
                <Outlet />
            </main>
            <AdminFooter
                theme={theme}
                onThemeToggle={toggleTheme}
                onLogout={() => logoutMutation.mutate()}
                logoutPending={logoutMutation.isPending}
            />
        </div>
    )
}

export default AdminLayout
