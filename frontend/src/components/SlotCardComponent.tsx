import type { CheckInSlot } from "../types/Slot.ts"
import { useNavigate } from "react-router-dom"
import { SlotUtils } from "../util/SlotUtil.ts"

type Props = {
    slot: CheckInSlot
}

function SlotCardComponent({ slot }: Props) {
    const navigate = useNavigate()
    const displayName = SlotUtils.getSlotDisplayName(slot)

    return (
        <div
            className="border border-border rounded-[--radius-lg] p-4 mb-3 cursor-pointer bg-surface hover:border-primary transition-colors"
            onClick={() => {
                const date = slot.start.toISOString().slice(0, 10)
                navigate(`/checkin/${date}/${slot.id}`, {state: {slot}})
            }}
        >
            <img src={SlotUtils.getRoomImageUrl(slot.room ?? "")} alt={slot.room ?? ""} className="w-full rounded-[--radius-md] mb-3 object-cover max-h-40"/>
            <div className="font-semibold text-lg">
                {slot.displayDate}
            </div>

            {displayName && (
                <div className="mt-1 text-text-secondary">
                    {displayName}
                </div>
            )}

            {slot.room && (
                <div className="mt-1 text-muted text-sm">
                    {slot.room}
                </div>
            )}
        </div>
    )
}

export default SlotCardComponent
