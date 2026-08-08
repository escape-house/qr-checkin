import {BrowserRouter, Route, Routes} from "react-router-dom";
import CheckInPage from "./routes/CheckInPage.tsx";
import CheckInDetailPage from "./routes/CheckInDetailPage.tsx";
import AllRoomsPage from "./routes/AllRoomsPage.tsx";
import RoomCheckInPage from "./routes/RoomCheckInPage.tsx";

function Router() {

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CheckInPage />} />
                <Route path="/checkin/:date/:slotId" element={<CheckInDetailPage />} />
                <Route path="/rooms" element={<AllRoomsPage />} />
                <Route path="/rooms/:roomName" element={<RoomCheckInPage />} />
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
