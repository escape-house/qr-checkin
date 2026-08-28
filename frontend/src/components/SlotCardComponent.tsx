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
            className="rounded-sm mb-8 cursor-pointer bg-surface hover:bg-surface-raised transition-colors shadow-xl/30 shadow-white/20"
            onClick={() => {
                const date = slot.start.toISOString().slice(0, 10)
                navigate(`/checkin/${date}/${slot.id}`, {state: {slot}})
            }}
        >
            <div className="relative">
                {slot.room && (
                    <div className="absolute top-4 left-4 z-10 font-bold text-2xl leading-10 text-white drop-shadow-lg w-2/3">
                        {slot.room}
                    </div>
                )}
                <img src={SlotUtils.getRoomImageUrl(slot.room ?? "")} alt={slot.room ?? ""} className="w-full object-cover max-h-40 rounded-t-sm opacity-70"/>
            </div>
            <div className="p-4">
                <div className="flex flex-row-reverse justify-between text-lg">
                    <div>{slot.displayDate}</div>
                    {displayName && (
                        <div>{displayName}</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SlotCardComponent
