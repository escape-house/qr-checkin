import type { ReactNode, InputHTMLAttributes } from "react"
import { Input } from "./Input.tsx"

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    required?: boolean
    error?: string
    wrapperClassName?: string
    children?: ReactNode
}

export function FormField({ label, required = false, error, wrapperClassName, children, ...inputProps }: Props) {
    return (
        <div className={["flex flex-col gap-1", wrapperClassName].filter(Boolean).join(" ")}>
            <label className="text-sm font-medium text-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </label>
            {children ?? <Input error={!!error} {...inputProps} />}
            {error && <span className="text-xs text-error">{error}</span>}
        </div>
    )
}
