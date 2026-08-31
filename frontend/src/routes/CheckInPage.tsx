import {useEffect, useState} from "react"
import {useLocation, useParams} from "react-router-dom"
import {useQuery} from "@tanstack/react-query"
import type {CheckInSlot} from "../types/Slot.ts"
import {fetchCheckInSlot} from "../api/checkInApi.ts"
import CheckInForm from "../components/checkin/CheckInForm.tsx"
import SuccessScreen from "../components/checkin/SuccessScreen.tsx"
import KeyScreen from "../components/KeyScreen.tsx"
import {Button} from "../components/ui/Button.tsx"
import {useT} from "../i18n/LanguageContext.tsx"

function CheckInPage() {
    const {t, setLang} = useT()
    const {date, slotId, roomName} = useParams<{ date?: string; slotId?: string; roomName?: string }>()
    const location = useLocation()
    const slotFromState: CheckInSlot | undefined = location.state?.slot

    const isRoomMode = roomName !== undefined

    // Room mode: synthesize a slotless slot from the URL param.
    const roomSlot: CheckInSlot | undefined = isRoomMode ? {
        id: null,
        start: new Date(),
        end: new Date(),
        players: null,
        name: null,
        companyName: null,
        room: decodeURIComponent(roomName.replace("_", " ")),
        displayDate: "",
    } : undefined

    const {data: fetchedSlot, isPending, isError} = useQuery({
        queryKey: ["checkInSlot", date, slotId],
        queryFn: () => fetchCheckInSlot(date!, slotId!),
        enabled: !isRoomMode && !slotFromState,
    })

    const slot = roomSlot ?? slotFromState ?? fetchedSlot

    // Auto-switch to English when the booking was made in English.
    useEffect(() => {
        if (slot?.language === "en") setLang("en")
    }, [slot?.language])

    const [checkedIn, setCheckedIn] = useState(false)

    if (!isRoomMode && !slotFromState && isPending) return <KeyScreen />
    if (!isRoomMode && !slotFromState && isError) return <p className="text-error p-4">{t("checkinErrorLoading")}</p>
    if (!slot) return null

    if (checkedIn) return (
        <SuccessScreen>
            <p className="text-2xl font-semibold text-success">{t("checkinSuccessTitle")}</p>
            <p>{t("checkinSuccessMessage")}</p>
            <Button onClick={() => setCheckedIn(false)} className="mt-4">
                {t("checkinAnotherPerson")}
            </Button>
        </SuccessScreen>
    )

    return (
        <div className="max-w-lg mx-auto px-4 py-6">
            <CheckInForm slot={slot} onSuccess={() => setCheckedIn(true)} />
        </div>
    )
}

export default CheckInPage
