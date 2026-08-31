import { useEffect, useState, type ReactNode } from "react"
import "../KeyScreen.css"

type Props = {
    children: ReactNode
}

function SuccessScreen({ children }: Props) {
    const [number] = useState(() => Math.floor(100 + Math.random() * 900))

    useEffect(() => {
        const previous = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = previous
        }
    }, [])

    return (
        <div className="loading-root bg-black" role="status">
            <div className="loading-scene">
                <img className="loading-key" src="/loading/key.webp" alt="" />
                <div className="loading-tag-wrap">
                    <img className="loading-tag" src="/loading/key_tag.webp" alt="" />
                    <span className="loading-number">{number}</span>
                </div>
            </div>
            <div className="loading-foreground bg-black/40 px-8 w-full h-full flex flex-col justify-center text-center" style={{animation: "none"}}>
                {children}
            </div>
        </div>
    )
}

export default SuccessScreen
