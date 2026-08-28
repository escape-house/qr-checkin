import type { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
}

export function Input({ error = false, className = "", ...props }: Props) {
    return (
        <input
            {...props}
            className={[
                "w-full rounded-md border px-3 py-2 text-base bg-surface-raised text-text placeholder-muted transition-colors",
                error ? "border-error" : "border-border",
                "focus:outline-none focus:border-muted",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    )
}
