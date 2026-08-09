import {useQuery} from "@tanstack/react-query"
import {Navigate, Outlet, useLocation} from "react-router-dom"
import {fetchSession} from "../api/adminApi.ts"

export function AdminProtectedRoute() {
    const location = useLocation()
    const {data, isPending} = useQuery({
        queryKey: ["admin-session"],
        queryFn: fetchSession,
        retry: false,
    })

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen text-muted">
                Lade…
            </div>
        )
    }

    if (!data?.authenticated) {
        return (
            <Navigate
                to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`}
                replace
            />
        )
    }

    return <Outlet />
}
