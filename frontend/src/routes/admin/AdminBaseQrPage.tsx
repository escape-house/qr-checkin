import {useNavigate} from "react-router-dom"
import {QRCodeSVG} from "qrcode.react"
import {useRef} from "react"
import {useAdminTheme} from "../../hooks/useAdminTheme.ts"

const QR_SIZE = 280
const BASE_URL = `${location.origin}/`

function AdminBaseQrPage() {
    useAdminTheme()
    const navigate = useNavigate()
    const qrRef = useRef<SVGSVGElement>(null)

    function download() {
        const svg = qrRef.current
        if (!svg) return

        const canvas = document.createElement("canvas")
        const padding = 24
        canvas.width = QR_SIZE + padding * 2
        canvas.height = QR_SIZE + padding * 2
        const ctx = canvas.getContext("2d")!
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const svgData = new XMLSerializer().serializeToString(svg)
        const img = new Image()
        img.onload = () => {
            ctx.drawImage(img, padding, padding, QR_SIZE, QR_SIZE)
            const a = document.createElement("a")
            a.href = canvas.toDataURL("image/png")
            a.download = "checkin-qr.png"
            a.click()
        }
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    }

    function print() {
        window.print()
    }

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* Back button — hidden when printing */}
            <button
                onClick={() => navigate(-1)}
                className="print:hidden absolute top-4 left-4 p-2 rounded-full hover:bg-black/5 transition-colors text-text"
                aria-label="Zurück"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-8">
                {/* QR code */}
                <div className="p-6 bg-white rounded-2xl shadow-lg border border-border print:shadow-none print:border-none w-full md:max-w-xs">
                    <QRCodeSVG
                        ref={qrRef}
                        value={BASE_URL}
                        size={512}
                        className="w-full h-auto block"
                        level="M"
                    />
                </div>

                <p className="text-xs text-muted text-center break-all max-w-xs print:hidden">{BASE_URL}</p>

                {/* Actions */}
                <div className="flex gap-3 print:hidden">
                    <button
                        onClick={download}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-bg transition-colors"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Herunterladen
                    </button>
                    <button
                        onClick={print}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text hover:bg-bg transition-colors"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        Drucken
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminBaseQrPage
