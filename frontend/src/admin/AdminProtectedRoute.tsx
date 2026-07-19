import {
    useEffect,
    useState,
} from "react";
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";
import { adminApi } from "../service/BackendApiService.ts";

type AuthenticationStatus =
    | "checking"
    | "authenticated"
    | "anonymous";

export default function AdminProtectedRoute() {
    const location = useLocation();

    const [authenticationStatus, setAuthenticationStatus] =
        useState<AuthenticationStatus>("checking");

    useEffect(() => {
        let cancelled = false;

        async function checkAuthentication(): Promise<void> {
            try {
                const session = await adminApi.getSession();

                if (cancelled) {
                    return;
                }

                setAuthenticationStatus(
                    session.authenticated
                        ? "authenticated"
                        : "anonymous",
                );
            } catch (error) {
                console.error(
                    "Could not check admin session:",
                    error,
                );

                if (!cancelled) {
                    setAuthenticationStatus("anonymous");
                }
            }
        }

        void checkAuthentication();

        return () => {
            cancelled = true;
        };
    }, []);

    if (authenticationStatus === "checking") {
        return (
            <main className="admin-auth-loading">
                <p>Checking admin login...</p>
            </main>
        );
    }

    if (authenticationStatus === "anonymous") {
        return (
            <Navigate
                to="/admin"
                replace
                state={{
                    redirectTo:
                        location.pathname +
                        location.search,
                }}
            />
        );
    }

    return <Outlet />;
}