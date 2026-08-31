export type AppConfig = {
    roomOrder: string[]
}

export async function fetchConfig(): Promise<AppConfig> {
    const response = await fetch("/api/config")
    if (!response.ok) throw new Error("Failed to fetch config")
    return response.json()
}
