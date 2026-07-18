import {BrowserRouter, Route, Routes} from "react-router-dom";
import SlotsPage from "./pages/SlotsPage.tsx";
import Checkin from "./pages/Checkin.tsx";

function Router() {

    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SlotsPage />} />
                <Route path="/checking/:slotId" element={<Checkin />} />
                <Route path="/checking/" element={<Checkin />} />
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Router
