import type { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
}

export function Input({ error = false, className = "", ...props }: Props) {
    return (
        <input
            {...props}
            className={[
                "w-full rounded-[--radius-md] border px-3 py-2 text-base bg-[--color-surface] text-[--color-text] placeholder-[--color-muted] transition-colors",
                "focus:outline-none focus:ring-2",
                error
                    ? "border-[--color-error] focus:ring-[--color-error]/40"
                    : "border-[--color-border] focus:ring-[--color-primary]/40 focus:border-[--color-primary]",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    )
}