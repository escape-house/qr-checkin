import {useEffect, useState} from "react"

export function useAdminTheme() {
    const [theme] = useState<"dark" | "light">(() =>
        (localStorage.getItem("admin-theme") as "dark" | "light") ?? "dark"
    )

    useEffect(() => {
        const html = document.documentElement
        html.classList.toggle("admin-light", theme === "light")
        return () => html.classList.remove("admin-light")
    }, [theme])

    return theme
}
