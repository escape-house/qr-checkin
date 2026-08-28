import type {CheckInSlot} from "../../types/Slot.ts"
import {SlotUtils} from "../../util/SlotUtil.ts"
import {useT} from "../../i18n/LanguageContext.tsx"

type Props = {
    slot: CheckInSlot
}

function SlotInfo({slot}: Props) {
    const {t} = useT()
    const displayName = SlotUtils.getSlotDisplayName(slot)

    return (
        <div className="-mx-4 -mt-6 mb-2">
            <div className="relative">
                {slot.room && (
                    <div className="absolute top-4 left-4 z-10 font-bold text-2xl leading-10 text-white drop-shadow-lg w-2/3">
                        {slot.room}
                    </div>
                )}
                <img
                    src={SlotUtils.getRoomImageUrl(slot.room ?? "")}
                    alt={slot.room ?? ""}
                    className="w-full object-cover max-h-48 opacity-70 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
                />
            </div>

            {(slot.displayDate || displayName || slot.players != null) && (
                <div className="px-4 mt-4">
                    <div className="flex flex-row-reverse justify-between text-xl">
                        <div>{slot.displayDate}</div>
                        {displayName && <div>{displayName}</div>}
                    </div>
                    {slot.players != null && (
                        <div className="text-text-secondary mt-1">{slot.players} {t("slotPersons")}</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SlotInfo
