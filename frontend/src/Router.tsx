import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import CheckInPage from "./routes/CheckInPage.tsx";
import CheckInDetailPage from "./routes/CheckInDetailPage.tsx";
import AllRoomsPage from "./routes/AllRoomsPage.tsx";
import RoomCheckInPage from "./routes/RoomCheckInPage.tsx";
import AdminLoginPage from "./routes/admin/AdminLoginPage.tsx";
import AdminLayout from "./routes/admin/AdminLayout.tsx";
import AdminTimetablePage from "./routes/admin/AdminTimetablePage.tsx";
import AdminManageRegistrationsPage from "./routes/admin/AdminManageRegistrationsPage.tsx";
import {AdminProtectedRoute} from "./components/AdminProtectedRoute.tsx"
import AdminSlotQrPage from "./routes/admin/AdminSlotQrPage.tsx"
import AdminBaseQrPage from "./routes/admin/AdminBaseQrPage.tsx";

function Router() {

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CheckInPage />} />
                <Route path="/checkin/:date/:slotId" element={<CheckInDetailPage />} />
                <Route path="/rooms" element={<AllRoomsPage />} />
                <Route path="/rooms/:roomName" element={<RoomCheckInPage />} />
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
                {/*
                <Route path="/checkin/" element={<CheckInDetailPage />} />
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
                -*/}
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Router
