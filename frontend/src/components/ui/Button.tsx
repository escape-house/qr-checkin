import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "ghost"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
    primary:
        "bg-[--color-primary] text-white hover:bg-[--color-primary-hover] disabled:bg-[--color-primary-disabled] disabled:cursor-not-allowed",
    secondary:
        "bg-[--color-surface] text-[--color-text] border border-[--color-border] hover:border-[--color-primary] disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
        "bg-transparent text-[--color-primary] hover:underline disabled:opacity-50 disabled:cursor-not-allowed",
}

export function Button({ variant = "primary", fullWidth = false, className = "", children, ...props }: Props) {
    return (
        <button
            {...props}
            className={[
                "inline-flex items-center justify-center rounded-[--radius-md] px-4 py-3 text-base font-medium transition-colors cursor-pointer",
                variantClasses[variant],
                fullWidth ? "w-full" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </button>
    )
}