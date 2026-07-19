import {BrowserRouter, Route, Routes} from "react-router-dom";
import SlotsPage from "./pages/SlotsPage.tsx";
import Checkin from "./pages/Checkin.tsx";

function Router() {

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SlotsPage />} />
                <Route path="/checkin/:slotId" element={<Checkin />} />
                <Route path="/checkin/" element={<Checkin />} />
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Router
