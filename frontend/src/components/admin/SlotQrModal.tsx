import {useEffect} from "react"
import {QRCodeSVG} from "qrcode.react"

type Props = {
    url: string
    label: string
    onClose: () => void
}

export function SlotQrModal({url, label, onClose}: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-surface border border-border rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest">{label}</p>
                <div className="p-4 bg-white rounded-md">
                    <QRCodeSVG value={url} size={220} />
                </div>
                <p className="text-xs text-muted break-all max-w-xs text-center">{url}</p>
                <button
                    onClick={onClose}
                    className="text-sm text-muted hover:text-text transition-colors"
                >
                    Schließen
                </button>
            </div>
        </div>
    )
}
