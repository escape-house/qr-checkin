import {BrowserRouter, Route, Routes} from "react-router-dom";
import SlotsPage from "./pages/SlotsPage.tsx";
import Checkin from "./pages/Checkin.tsx";
import AdminProtectedRoute from "./admin/AdminProtectedRoute.tsx";
import AdminRegistrationsPage from "./pages/AdminRegistrationPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.tsx";

function Router() {

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SlotsPage />} />
                <Route path="/checkin/:slotId" element={<Checkin />} />
                <Route path="/checkin/" element={<Checkin />} />
                <Route
                    path="/admin"
                    element={<AdminPage />}
                />

                <Route element={<AdminProtectedRoute />}>
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboardPage />}>
                    </Route>
                    <Route
                        path="/admin/registrations"
                        element={<AdminRegistrationsPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Router
