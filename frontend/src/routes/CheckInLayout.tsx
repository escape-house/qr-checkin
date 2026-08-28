import {Outlet} from "react-router-dom"
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx"

function CheckInLayout() {
    return (
        <>
            <div className="fixed top-3 right-3 z-50">
                <LanguageSwitcher />
            </div>
            <Outlet />
        </>
    )
}

export default CheckInLayout
