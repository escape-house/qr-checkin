import type { InputHTMLAttributes, ReactNode } from "react"

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    children: ReactNode
}

export function Checkbox({ children, className = "", ...props }: Props) {
    return (
        <label className={["flex items-start gap-3 cursor-pointer", className].filter(Boolean).join(" ")}>
            <input
                type="checkbox"
                {...props}
                className="mt-0.5 size-4 shrink-0 accent-primary cursor-pointer"
            />
            <span className="text-sm text-text">{children}</span>
        </label>
    )
}
