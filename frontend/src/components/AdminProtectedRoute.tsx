import {useQuery} from "@tanstack/react-query"
import {Navigate, Outlet, useLocation} from "react-router-dom"
import {fetchSession} from "../api/adminApi.ts"
import KeyScreen from "./KeyScreen.tsx"

export function AdminProtectedRoute() {
    const location = useLocation()
    const {data, isPending} = useQuery({
        queryKey: ["admin-session"],
        queryFn: fetchSession,
        retry: false,
    })

    if (isPending) {
        return <KeyScreen />
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
