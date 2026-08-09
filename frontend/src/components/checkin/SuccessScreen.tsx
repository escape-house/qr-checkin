import type {CheckInSlot} from "../../types/Slot.ts"
import SlotInfo from "./SlotInfo.tsx"
import {Button} from "../ui/Button.tsx"

type Props = {
    slot: CheckInSlot
    onCheckInAnother: () => void
}

function SuccessScreen({slot, onCheckInAnother}: Props) {
    return (
        <div className="text-center">
            <SlotInfo slot={slot}/>
            <p className="text-xl font-semibold text-success">Erfolgreich eingecheckt!</p>
            <Button onClick={onCheckInAnother} className="mt-4">
                Weitere Person einchecken
            </Button>
        </div>
    )
}

export default SuccessScreen
