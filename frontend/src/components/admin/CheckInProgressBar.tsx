import type {SlotStatus} from "../../api/dashboardApi.ts"

type Props = {
    checkedIn: number
    total: number
    status: SlotStatus
}

const fillStyles: Record<SlotStatus, string> = {
    future:    "bg-future-accent",
    checkin:   "bg-checkin-accent",
    active:    "bg-active-accent",
    past:      "bg-past-accent",
    blocked:   "bg-blocked-accent",
    notBooked: "bg-border",
}

export function CheckInProgressBar({checkedIn, total, status}: Props) {
    const pct = total > 0 ? Math.min(100, (checkedIn / total) * 100) : 0

    return (
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-500 ${fillStyles[status]}`}
                style={{width: `${pct}%`}}
            />
        </div>
    )
}
