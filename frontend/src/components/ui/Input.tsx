import type { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
}

export function Input({ error = false, className = "", ...props }: Props) {
    return (
        <input
            {...props}
            className={[
                "w-full rounded-radius-md border border-text-secondary px-3 py-2 text-base bg-surface text-text placeholder-muted transition-colors",
                "focus:outline-none focus:shadow",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    )
}