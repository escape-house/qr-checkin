import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "ghost"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
    primary:
        "bg-primary text-white hover:bg-primary-hover disabled:bg-primary-disabled disabled:cursor-not-allowed",
    secondary:
        "bg-surface-raised text-text border border-border hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
        "bg-transparent text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed",
}

export function Button({ variant = "primary", fullWidth = false, className = "", children, ...props }: Props) {
    return (
        <button
            {...props}
            className={[
                "inline-flex items-center justify-center rounded-md px-4 py-3 text-base font-medium transition-colors cursor-pointer",
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