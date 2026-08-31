import {useQuery} from "@tanstack/react-query"
import SlotCardComponent from "../components/SlotCardComponent.tsx"
import {SlotUtils} from "../util/SlotUtil.ts"
import {fetchCheckInSlots} from "../api/checkInApi.ts"
import {Link} from "react-router-dom"
import KeyScreen from "../components/KeyScreen.tsx"
import {useT} from "../i18n/LanguageContext.tsx"

function CheckInOverviewPage() {
    const {t} = useT()
    const {data: slots, isPending, isError} = useQuery({
        queryKey: ["checkInSlots"],
        queryFn: fetchCheckInSlots,
    })

    if (isPending) return <KeyScreen />
    if (isError) return <p className="text-error p-4">{t("overviewErrorLoading")}</p>

    return (
        <div className="max-w-lg mx-auto px-4 flex flex-col min-h-screen">
            <header className="flex flex-col justify-center items-center pt-8 pb-5">
                <img src="/Weblogo.webp" alt="Escape House" className="h-16 w-auto mb-2 object-contain" />
                <h1 className="font-serif text-3xl font-semibold tracking-[0.15em] uppercase text-white">
                    {t("overviewTitle")}
                </h1>
            </header>
            {
                slots.length === 0 ?
                    <p className="text-center text-text-secondary p-4">{t("overviewNoSlots")}</p>
                    :
                    <div className="flex-1">
                        {slots
                            .sort(SlotUtils.slotStartTimeComparator)
                            .map((slot) => (
                            <SlotCardComponent key={slot.id} slot={slot}/>
                        ))}
                    </div>
            }
            <div className={"p-4 text-center w-full"}>
                {t("checkInTimeInfo")}
            </div>

            <footer className="mt-8 mb-4 pt-4 border-t border-border flex justify-between text-sm text-text">
                <div className="flex flex-row w-1/2 justify-between">
                    <a href="https://escape-house.at/allgemeine-geschaftsbedingungen/" target="_blank" className="hover:text-text transition-colors">{t("overviewFooterTerms")}</a>
                    <a href="https://escape-house.at/impressum/" target="_blank" className="hover:text-text transition-colors">{t("overviewFooterImprint")}</a>
                </div>
                <Link to="/rooms" className="hover:text-primary transition-colors">{t("overviewRoomNotListed")}</Link>
            </footer>
        </div>
    )
}

export default CheckInOverviewPage
