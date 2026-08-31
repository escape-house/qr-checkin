import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import CheckInOverviewPage from "./routes/CheckInOverviewPage.tsx";
import CheckInPage from "./routes/CheckInPage.tsx";
import AllRoomsPage from "./routes/AllRoomsPage.tsx";
import CheckInLayout from "./routes/CheckInLayout.tsx";
import AdminLoginPage from "./routes/admin/AdminLoginPage.tsx";
import AdminLayout from "./routes/admin/AdminLayout.tsx";
import AdminTimetablePage from "./routes/admin/AdminTimetablePage.tsx";
import AdminManageRegistrationsPage from "./routes/admin/AdminManageRegistrationsPage.tsx";
import {AdminProtectedRoute} from "./components/AdminProtectedRoute.tsx"
import AdminSlotQrPage from "./routes/admin/AdminSlotQrPage.tsx"
import AdminBaseQrPage from "./routes/admin/AdminBaseQrPage.tsx";
import KeyScreen from "./components/KeyScreen.tsx";

function Router() {

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route element={<CheckInLayout />}>
                    <Route path="/" element={<CheckInOverviewPage />} />
                    <Route path="/checkin/:date/:slotId" element={<CheckInPage />} />
                    <Route path="/rooms" element={<AllRoomsPage />} />
                    <Route path="/rooms/:roomName" element={<CheckInPage />} />
                </Route>
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route element={<AdminProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<Navigate to="/admin/timetable" replace />} />
                        <Route path="/admin/timetable" element={<AdminTimetablePage />} />
                        <Route path="/admin/registrations" element={<AdminManageRegistrationsPage />} />
                    </Route>
                    <Route path="/admin/qr/:date/:slotId" element={<AdminSlotQrPage />} />
                    <Route path="/admin/qr" element={<AdminBaseQrPage />} />
                </Route>
                <Route path="*" element={<KeyScreen number={404}>Not Found</KeyScreen>} />
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Router
