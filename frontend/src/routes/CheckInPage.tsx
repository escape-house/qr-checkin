import {useQuery} from "@tanstack/react-query"
import SlotCardComponent from "../components/SlotCardComponent.tsx"
import {SlotUtils} from "../util/SlotUtil.ts";
import {useState} from "react";
import {fetchCheckInSlots} from "../api/checkInApi.ts";
import {Button} from "../components/ui/Button.tsx"
import {Link} from "react-router-dom"

function CheckInPage() {
    const [moreExpanded, setMoreExpanded] = useState<boolean>(false)
    const {data: slots, isPending, isError} = useQuery({
        queryKey: ["checkInSlots"],
        queryFn: fetchCheckInSlots,
    })

    if (isPending) return <p className="text-[--color-text-secondary] p-4">Lade Slots…</p>
    if (isError) return <p className="text-[--color-error] p-4">Fehler beim Laden der Slots.</p>
    if (slots.length === 0) return <p className="text-[--color-text-secondary] p-4">Keine aktiven Slots.</p>

    return (
        <div className="max-w-lg mx-auto px-4 py-6 flex flex-col min-h-screen">
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">Check-In</h1>

                {slots
                    .filter(SlotUtils.isBooked)
                    .sort(SlotUtils.slotStartTimeComparator)
                    .map((slot) => (
                    <SlotCardComponent key={slot.id} slot={slot}/>
                ))}

                <Button variant="secondary" onClick={() => setMoreExpanded(!moreExpanded)} className="mb-3">
                    {moreExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
                </Button>

                {moreExpanded && slots
                    .filter(SlotUtils.isNotBooked)
                    .sort(SlotUtils.slotStartTimeComparator)
                    .map((slot) => (
                        <SlotCardComponent key={slot.id} slot={slot}/>
                    ))
                }
            </div>

            <footer className="mt-8 pt-4 border-t border-[--color-border] flex justify-between text-sm text-[--color-muted]">
                <Link to="/agb" className="hover:text-[--color-text] transition-colors">AGB</Link>
                <Link to="/rooms" className="hover:text-[--color-primary] transition-colors">Raum nicht dabei?</Link>
            </footer>
        </div>
    )
}

export default CheckInPage
