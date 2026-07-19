import {
    useEffect,
    useState,
} from "react";
import {
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import {
    adminApi,
    HttpError,
} from "../service/BackendApiService.ts";
import "./AdminPage.css";

type AuthenticationStatus =
    | "checking"
    | "anonymous"
    | "authenticated";

type AdminLocationState = {
    redirectTo?: string;
};

export default function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const locationState =
        location.state as AdminLocationState | null;

    const redirectTo =
        locationState?.redirectTo ??
        "/admin/registrations";

    const [
        authenticationStatus,
        setAuthenticationStatus,
    ] = useState<AuthenticationStatus>("checking");

    const [password, setPassword] = useState("");
    const [loginError, setLoginError] =
        useState<string | null>(null);

    const [isLoggingIn, setIsLoggingIn] =
        useState(false);

    useEffect(() => {
        let cancelled = false;

        async function checkSession(): Promise<void> {
            try {
                const session =
                    await adminApi.getSession();

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
                    setAuthenticationStatus(
                        "anonymous",
                    );
                }
            }
        }

        void checkSession();

        return () => {
            cancelled = true;
        };
    }, []);

    if (authenticationStatus === "checking") {
        return (
            <main className="admin-login-page">
                <section className="admin-login-card">
                    <div className="admin-login-loader" />

                    <p>Checking admin login...</p>
                </section>
            </main>
        );
    }

    if (authenticationStatus === "authenticated") {
        return (
            <Navigate
                to={redirectTo}
                replace
            />
        );
    }

    return (
        <main className="admin-login-page">
            <section className="admin-login-card">
                <div
                    className="admin-login-card__icon"
                    aria-hidden="true"
                >
                    🔒
                </div>

                <header className="admin-login-card__header">
                    <p>Escape House</p>
                    <h1>Admin login</h1>

                    <span>
                        Enter the admin password to continue.
                    </span>
                </header>

                <form
                    className="admin-login-form"
                    onSubmit={async event => {
                        event.preventDefault();

                        if (
                            isLoggingIn ||
                            password.trim() === ""
                        ) {
                            return;
                        }

                        setIsLoggingIn(true);
                        setLoginError(null);

                        try {
                            const result =
                                await adminApi.login(
                                    password,
                                );

                            if (
                                !result.authenticated
                            ) {
                                setLoginError(
                                    "Login was not accepted.",
                                );

                                return;
                            }

                            setPassword("");

                            navigate(redirectTo, {
                                replace: true,
                            });
                        } catch (error) {
                            if (
                                error instanceof
                                HttpError &&
                                error.status === 401
                            ) {
                                setLoginError(
                                    "The password is incorrect.",
                                );
                            } else {
                                setLoginError(
                                    error instanceof Error
                                        ? error.message
                                        : "Login failed.",
                                );
                            }
                        } finally {
                            setIsLoggingIn(false);
                        }
                    }}
                >
                    <label className="admin-login-form__field">
                        <span>Password</span>

                        <input
                            type="password"
                            value={password}
                            onChange={event => {
                                setPassword(
                                    event.target.value,
                                );

                                if (loginError) {
                                    setLoginError(null);
                                }
                            }}
                            autoComplete="current-password"
                            placeholder="Admin password"
                            disabled={isLoggingIn}
                            required
                            autoFocus
                        />
                    </label>

                    {loginError && (
                        <p
                            className="admin-login-form__error"
                            role="alert"
                        >
                            {loginError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={
                            isLoggingIn ||
                            password.trim() === ""
                        }
                    >
                        {isLoggingIn
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>
            </section>
        </main>
    );
}