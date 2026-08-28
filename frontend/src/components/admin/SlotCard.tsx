import {useState} from "react"
import {useNavigate} from "react-router-dom"
import type {AdminSlot, SlotStatus} from "../../api/dashboardApi.ts"
import {CheckInProgressBar} from "./CheckInProgressBar.tsx"

type Props = {
    slot: AdminSlot
    status: SlotStatus
}

// Each status has a bg/border/text from theme tokens, plus a left accent bar color.
// The accent bar is a separate div to avoid border shorthand overriding border-l-width.
const cardStyles: Record<SlotStatus, string> = {
    future:    "bg-future-bg border border-future-border text-future-text",
    checkin:   "bg-checkin-bg border border-checkin-border text-checkin-text",
    active:    "bg-active-bg border border-active-border text-active-text",
    past:      "bg-past-bg border border-past-border text-past-text opacity-60",
    blocked:   "bg-blocked-bg border border-blocked-border text-blocked-text",
    notBooked: "bg-surface border border-border text-muted/50",
}

const accentBar: Record<SlotStatus, string> = {
    future:    "bg-future-accent",
    checkin:   "bg-checkin-accent",
    active:    "bg-active-accent",
    past:      "bg-past-accent",
    blocked:   "bg-blocked-accent",
    notBooked: "bg-border",
}

const badgeStyles: Record<SlotStatus, string> = {
    future:    "bg-future-accent/20 text-future-text",
    checkin:   "bg-checkin-accent/20 text-checkin-text",
    active:    "bg-active-accent/20 text-active-text",
    past:      "bg-past-border text-past-text",
    blocked:   "bg-blocked-border text-blocked-text",
    notBooked: "bg-border text-muted/50",
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = {hour: "2-digit", minute: "2-digit"}

const DISPLAY_NAMES: Partial<Record<string, string>> = {
    block: "Blockiert",
    mask:  "Frei",
}

function ChevronIcon({open}: {open: boolean}) {
    return (
        <svg
            className={`w-6 h-6 md:w-3 md:h-3 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="2,4 6,8 10,4" />
        </svg>
    )
}

function ConsentDot({ok}: {ok: boolean}) {
    return (
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-red-500"}`} />
    )
}

const isBooking = (type: string) => type !== "block" && type !== "mask"

function QrIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-3.5 md:h-3.5" fill="currentColor">
            <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zM14 3h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 14h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zM14 14h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2z"/>
        </svg>
    )
}

export function SlotCard({slot, status}: Props) {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const start = new Date(slot.start)
    const checkedIn = slot.checkedInPlayers.length
    const total = slot.players ?? 0
    const allPhotosOk = checkedIn > 0 && slot.checkedInPlayers.every(p => p.wantsPhotosOnline)
    const displayName = DISPLAY_NAMES[slot.type] ?? (slot.companyName?.trim() || slot.name || "–")
    const booked = isBooking(slot.type)
    const isBlocked = slot.type === "block"

    const slotDate = slot.start.split("T")[0]

    return (
        <div className={`rounded-md flex flex-row overflow-hidden transition-colors ${cardStyles[status]}`}>
            {/* Left accent bar */}
            <div className={`w-1 shrink-0 ${accentBar[status]}`} />
            {/* Card content */}
            <div className="flex-1 flex flex-col min-w-0">
            {/* Main card body */}
            <div className="px-3 py-2 flex flex-col gap-1">
                {/* Time row */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold tabular-nums">
                        {start.toLocaleTimeString("de-AT", TIME_FORMAT)}
                    </span>
                    <div className="flex items-center gap-1.5">
                        {allPhotosOk && (
                            <span className="text-xs leading-none" title="Alle erlauben Fotos">📷</span>
                        )}
                        {slot.id != null && (
                            <button
                                onClick={() => navigate(`/admin/qr/${slotDate}/${slot.id}`)}
                                className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer p-1 md:p-0"
                                title="QR-Code anzeigen"
                            >
                                <QrIcon />
                            </button>
                        )}
                        {(booked || isBlocked) && checkedIn > 0 && (
                            <button
                                onClick={() => setOpen(o => !o)}
                                className="flex items-center gap-0.5 text-xs opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                                title="Check-Ins anzeigen"
                            >
                                <ChevronIcon open={open} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Name */}
                <div className="text-sm font-medium leading-tight truncate" title={displayName}>
                    {displayName}
                </div>

                {/* Progress + count — always rendered to keep uniform card height */}
                <div className="flex flex-col gap-1 mt-0.5">
                    <div className={booked ? "" : "invisible"}>
                        <CheckInProgressBar checkedIn={checkedIn} total={total} status={status} />
                    </div>
                    <div className={`flex items-center gap-1.5 ${!booked && !(isBlocked && checkedIn > 0) ? "invisible" : ""}`}>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${badgeStyles[status]}`}>
                            {booked ? `${checkedIn}/${total}` : checkedIn}
                        </span>
                        <span className="text-xs opacity-60 leading-tight">eingecheckt</span>
                    </div>
                </div>
            </div>

            {/* Expandable player list */}
            {open && (booked || isBlocked) && (
                <div className="border-t border-border/50 px-3 py-2 flex flex-col gap-1">
                    {slot.checkedInPlayers.map(p => (
                        <div key={p.id} className="flex items-center justify-between gap-2 text-xs">
                            <span className="truncate">{p.firstName} {p.lastName}</span>
                            <div className="flex items-center gap-1.5 shrink-0" title="AGB / Fotos">
                                <ConsentDot ok={p.wantsPhotosOnline} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>

    )
}
