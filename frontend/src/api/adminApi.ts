export type AuthResponse = {
    authenticated: boolean
}

export async function fetchSession(): Promise<AuthResponse> {
    const response = await fetch("/api/auth/session")
    if (!response.ok) throw new Error("Session check failed")
    return response.json()
}

export async function login(password: string): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({password}),
    })
    if (response.status === 401) throw new Error("Falsches Passwort.")
    if (!response.ok) throw new Error("Login fehlgeschlagen.")
    return response.json()
}

export async function logout(): Promise<void> {
    await fetch("/api/auth/logout", {method: "POST"})
}
