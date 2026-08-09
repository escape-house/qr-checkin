import {useNavigate, useParams} from "react-router-dom"
import {QRCodeSVG} from "qrcode.react"

function AdminSlotQrPage() {
    const {date, slotId} = useParams<{date: string; slotId: string}>()
    const navigate = useNavigate()

    const url = `${location.origin}/checkin/${date}/${slotId}`

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-black/5 transition-colors text-text"
                aria-label="Zurück"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
                <div className="p-5 bg-white rounded-2xl shadow-lg border border-border">
                    <QRCodeSVG
                        value={url}
                        size={Math.min(window.innerWidth - 80, 300)}
                        level="M"
                    />
                </div>
                <p className="text-xs text-muted text-center break-all max-w-xs">{url}</p>
            </div>
        </div>
    )
}

export default AdminSlotQrPage
