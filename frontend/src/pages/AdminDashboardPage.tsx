import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    useNavigate,
} from "react-router-dom";
import {
    adminDashboardApi,
    HttpError,
} from "../service/BackendApiService.ts";
import type {
    AdminCheckInSlot,
} from "../types/AdminDashBoard.ts";
import {
    AdminTimetable,
} from "../components/admin/dashboard/AdminTimetable.tsx";
import "./AdminDashboardPage.css";
import {AdminNavigation} from "../components/admin/AdminNavigation.tsx";

export default function AdminDashboardPage() {
    const navigate = useNavigate();

    const [slots, setSlots] =
        useState<AdminCheckInSlot[]>([]);

    const [now, setNow] =
        useState(() => new Date());

    const [showPastSlots, setShowPastSlots] =
        useState(false);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const loadDashboard = useCallback(
        async (backgroundRefresh = false) => {
            if (backgroundRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            try {
                const response =
                    await adminDashboardApi
                        .fetchDashboard();

                setSlots(response);
                setNow(new Date());
            } catch (requestError) {
                if (
                    requestError instanceof HttpError &&
                    requestError.status === 401
                ) {
                    navigate("/admin", {
                        replace: true,
                        state: {
                            redirectTo:
                                "/admin/dashboard",
                        },
                    });

                    return;
                }

                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Could not load the dashboard",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [navigate],
    );

    /*
     * Update the current time every minute so appointments
     * disappear automatically after their end time.
     */
    useEffect(() => {
        const intervalId = window.setInterval(
            () => {
                setNow(new Date());
            },
            60_000,
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const pastSlotCount = useMemo(
        () =>
            slots.filter(
                slot =>
                    slot.end.getTime() <=
                    now.getTime(),
            ).length,
        [now, slots],
    );

    const displayedSlots = useMemo(
        () =>
            showPastSlots
                ? slots
                : slots.filter(
                    slot =>
                        slot.end.getTime() >
                        now.getTime(),
                ),
        [
            now,
            showPastSlots,
            slots,
        ],
    );

    return (

        <main className="admin-dashboard-page">
            <header className="admin-dashboard-header">
                <div className="admin-dashboard-header__title">
                    <p className="admin-dashboard-header__label">
                        Administration
                    </p>

                    <h1>Check-in dashboard</h1>

                    <p className="admin-dashboard-header__description">
                        Heutige Termine und registrierte Spieler
                    </p>
                </div>

                <div className="admin-dashboard-header__right">

                    <div className="admin-dashboard-header__actions">
                        <button
                            type="button"
                            className="admin-dashboard-header__secondary-button"
                            disabled={pastSlotCount === 0}
                            onClick={() =>
                                setShowPastSlots(current => !current)
                            }
                        >
                            {showPastSlots
                                ? "Vergangene Termine verstecken"
                                : `Vergangene Termine anzeigen (${pastSlotCount})`}
                        </button>

                        <button
                            type="button"
                            disabled={refreshing}
                            onClick={() =>
                                void loadDashboard(true)
                            }
                        >
                            {refreshing
                                ? "Aktualisieren..."
                                : "Aktualisieren"}
                        </button>
                    </div>
                    <AdminNavigation />
                </div>
            </header>
            {error && (
                <p
                    className="admin-dashboard-error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {loading ? (
                <p className="admin-dashboard-state">
                    Loading dashboard...
                </p>
            ) : (
                <>
                    {displayedSlots.length === 0 ? (
                        <section className="admin-dashboard-state">
                            <p>
                                No current or upcoming
                                appointments.
                            </p>

                            {pastSlotCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPastSlots(true)
                                    }
                                >
                                    Vergangene Termine anzeigen
                                </button>
                            )}
                        </section>
                    ) : (
                        <AdminTimetable
                            slots={slots}
                            now={now}
                            showPastSlots={showPastSlots}
                        />
                    )}
                </>
            )}
        </main>
    );
}