export type Registration = {
    id: string
    firstName: string
    lastName: string
    email: string | null
    roomName: string
    slotId: number
    registrationDate: string
    agreesToTermsAndCondition: boolean
    wantsPhotosOnline: boolean
    wantsNewsletter: boolean
}

export type RegistrationPage = {
    items: Registration[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
}

export type RegistrationFilters = {
    name: string
    date: string
    room: string
    slotId: string
}

export type RegistrationUpdate = {
    firstName: string
    lastName: string
    email: string | null
    roomName: string
    slotId: number
    agreesToTermsAndCondition: boolean
    wantsPhotosOnline: boolean
    wantsNewsletter: boolean
}

export async function fetchRegistrations(
    page: number,
    pageSize: number,
    filters: RegistrationFilters,
): Promise<RegistrationPage> {
    const params = new URLSearchParams({page: String(page), pageSize: String(pageSize)})
    if (filters.name.trim()) params.set("name", filters.name.trim())
    if (filters.date.trim()) params.set("date", filters.date.trim())
    if (filters.room.trim()) params.set("room", filters.room.trim())
    if (filters.slotId.trim()) params.set("slotId", filters.slotId.trim())

    const response = await fetch(`/api/admin/registrations?${params}`)
    if (!response.ok) throw new Error("Failed to fetch registrations")
    return response.json()
}

export async function updateRegistration(id: string, data: RegistrationUpdate): Promise<Registration> {
    const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update registration")
    return response.json()
}

export async function deleteRegistration(id: string): Promise<void> {
    const response = await fetch(`/api/admin/registrations/${id}`, {method: "DELETE"})
    if (!response.ok) throw new Error("Failed to delete registration")
}
