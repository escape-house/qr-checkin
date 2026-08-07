import { NavLink } from "react-router-dom";
import "./AdminNavigation.css";

export function AdminNavigation() {
    return (
        <nav
            className="admin-navigation"
            aria-label="Admin navigation"
        >
            <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                    [
                        "admin-navigation__link",
                        isActive
                            ? "admin-navigation__link--active"
                            : "",
                    ]
                        .filter(Boolean)
                        .join(" ")
                }
            >
                <span
                    className="admin-navigation__icon"
                    aria-hidden="true"
                >
                    ▦
                </span>

                <span>Dashboard</span>
            </NavLink>

            <NavLink
                to="/admin/registrations"
                className={({ isActive }) =>
                    [
                        "admin-navigation__link",
                        isActive
                            ? "admin-navigation__link--active"
                            : "",
                    ]
                        .filter(Boolean)
                        .join(" ")
                }
            >
                <span
                    className="admin-navigation__icon"
                    aria-hidden="true"
                >
                    ☰
                </span>

                <span>Registrierungen</span>
            </NavLink>
        </nav>
    );
}