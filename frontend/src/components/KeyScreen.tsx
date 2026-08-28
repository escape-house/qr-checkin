import { useEffect, useState, type ReactNode } from "react"
import "./KeyScreen.css"

type Props = {
    /** Fixed number on the key tag. When omitted the number flickers rapidly. */
    number?: number
    children?: ReactNode
}

function KeyScreen({ number: fixedNumber, children }: Props) {
    const [number, setNumber] = useState(() => Math.floor(100 + Math.random() * 900))

    useEffect(() => {
        if (fixedNumber !== undefined) return
        const id = setInterval(() => {
            setNumber(Math.floor(100 + Math.random() * 900))
        }, 1000 / 20)
        return () => clearInterval(id)
    }, [fixedNumber])

    useEffect(() => {
        const previous = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = previous
        }
    }, [])

    return (
        <div className="loading-root" role="status" aria-live="polite">
            <div className="loading-scene">
                <img className="loading-key" src="/loading/key.webp" alt="" />
                <div className="loading-tag-wrap">
                    <img className="loading-tag" src="/loading/key_tag.webp" alt="" />
                    <span className="loading-number">{fixedNumber ?? number}</span>
                </div>
            </div>
            <div className="loading-foreground">
                {children ?? <div className="loading-spinner" />}
            </div>
        </div>
    )
}

export default KeyScreen
