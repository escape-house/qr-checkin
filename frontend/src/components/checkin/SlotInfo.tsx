import type {CheckInSlot} from "../../types/Slot.ts"
import {SlotUtils} from "../../util/SlotUtil.ts"

type Props = {
    slot: CheckInSlot
}

function SlotInfo({slot}: Props) {
    return (
        <div className="mb-6">
            {slot.room && (
                <img
                    src={SlotUtils.getRoomImageUrl(slot.room)}
                    alt={slot.room}
                    className="w-full rounded-[--radius-lg] mb-3 object-cover max-h-48"
                />
            )}
            <div className="font-semibold text-xl">{slot.displayDate}</div>
            {slot.room && <div className="text-text-secondary mt-1">{slot.room}</div>}
            {SlotUtils.getSlotDisplayName(slot) && (
                <div className="mt-1">{SlotUtils.getSlotDisplayName(slot)}</div>
            )}
            {slot.players != null && (
                <div className="text-muted mt-1">{slot.players} Personen</div>
            )}
        </div>
    )
}

export default SlotInfo
