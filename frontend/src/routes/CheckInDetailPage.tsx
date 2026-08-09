import {useState} from "react"
import {useLocation, useParams} from "react-router-dom"
import {useQuery} from "@tanstack/react-query"
import type {CheckInSlot} from "../types/Slot.ts"
import {fetchCheckInSlot} from "../api/checkInApi.ts"
import CheckInForm from "../components/checkin/CheckInForm.tsx"
import SuccessScreen from "../components/checkin/SuccessScreen.tsx"

function CheckInDetailPage() {
    const {date, slotId} = useParams<{date: string; slotId: string}>()
    const location = useLocation()
    const slotFromState: CheckInSlot | undefined = location.state?.slot

    const {data: fetchedSlot, isPending, isError} = useQuery({
        queryKey: ["checkInSlot", date, slotId],
        queryFn: () => fetchCheckInSlot(date!, slotId!),
        enabled: !slotFromState,
    })

    const slot = slotFromState ?? fetchedSlot

    const [checkedIn, setCheckedIn] = useState(false)

    if (!slotFromState && isPending) return <p className="text-text-secondary p-4">Lade Slot…</p>
    if (!slotFromState && isError) return <p className="text-error p-4">Fehler beim Laden des Slots.</p>
    if (!slot) return null

    return (
        <div className="max-w-lg mx-auto px-4 py-6">
            {checkedIn
                ? <SuccessScreen slot={slot} onCheckInAnother={() => setCheckedIn(false)}/>
                : <CheckInForm slot={slot} onSuccess={() => setCheckedIn(true)}/>
            }
        </div>
    )
}

export default CheckInDetailPage
