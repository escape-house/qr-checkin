import type {
    Slot,
    SlotDto,
} from "../types/Slot.ts";
import type {CheckInForm} from "../types/CheckInForm.ts";
import type {Registration, RegistrationFilter, RegistrationPage, RegistrationUpdate} from "../types/Registration.ts";

export class HttpError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly responseBody: string,
    ) {
        super(message);
        this.name = "HttpError";
    }
}

async function request<T>(
    url: string,
    options: RequestInit,
): Promise<T | null> {
    const response = await fetch(url, {
        credentials: "same-origin",
        ...options,
    });

    const responseText = await response.text();

    /*
     * fetch() does not automatically throw for HTTP error
     * responses such as 400 or 500.
     */
    if (!response.ok) {
        throw new HttpError(
            getErrorMessage(
                response.status,
                responseText,
            ),
            response.status,
            responseText,
        );
    }

    if (!responseText) {
        return null;
    }

    const contentType =
        response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        try {
            return JSON.parse(responseText) as T;
        } catch {
            throw new Error(
                `Invalid JSON received from ${url}`,
            );
        }
    }

    /*
     * Allows the backend to return a plain string.
     */
    return responseText as T;
}

function getErrorMessage(
    status: number,
    responseBody: string,
): string {
    if (!responseBody) {
        return `Request failed with status ${status}`;
    }

    try {
        const parsed = JSON.parse(responseBody) as {
            error?: unknown;
            message?: unknown;
        };

        if (typeof parsed.error === "string") {
            return parsed.error;
        }

        if (typeof parsed.message === "string") {
            return parsed.message;
        }
    } catch {
        // The response was not JSON.
    }

    return responseBody;
}

function slotDtoToSlot(dto: SlotDto): Slot {
    const start = new Date(dto.start);
    const end = new Date(dto.end);

    if (Number.isNaN(start.getTime())) {
        throw new Error(
            `Invalid slot start date: ${dto.start}`,
        );
    }

    if (Number.isNaN(end.getTime())) {
        throw new Error(
            `Invalid slot end date: ${dto.end}`,
        );
    }

    return {
        ...dto,
        start,
        end,
    };
}

export const checkInApi = {
    async fetchCheckInSlots(): Promise<Slot[]> {
        const response = await request<SlotDto[]>(
            "/api/quinbook/checkInSlots",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            },
        );

        if (!Array.isArray(response)) {
            throw new Error(
                "The backend did not return a slot array",
            );
        }
        return response.map(slotDtoToSlot);
    },

    async submitCheckIn(
        roomName: string,
        slotId: number,
        form: CheckInForm,
    ): Promise<unknown> {
        const encodedRoomName =
            encodeURIComponent(roomName);

        const encodedSlotId =
            encodeURIComponent(slotId.toString());

        return request<unknown>(
            `/api/checkin/${encodedRoomName}/${encodedSlotId}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            },
        );
    },
};

export interface AdminAuthenticationResponse {
    authenticated: boolean;
}

export const adminApi = {
    async getSession(): Promise<AdminAuthenticationResponse> {
        const response =
            await request<AdminAuthenticationResponse>(
                "/api/auth/session",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

        return response ?? { authenticated: false };
    },

    async login(
        password: string,
    ): Promise<AdminAuthenticationResponse> {
        const response =
            await request<AdminAuthenticationResponse>(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ password }),
                },
            );

        if (response === null) {
            throw new Error(
                "The login endpoint returned no response"
            );
        }

        return response;
    },

    async logout(): Promise<void> {
        await request<AdminAuthenticationResponse>(
            "/api/auth/logout",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
            },
        );
    },

    async testAdminAccess(): Promise<string> {
        const response = await request<{ message: string }>(
            "/api/admin/ping",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            },
        );

        if (response === null) {
            throw new Error("Empty admin response");
        }

        return response.message;
    },
};

export const registrationApi = {
    async fetchRegistrations(
        filter: RegistrationFilter,
    ): Promise<RegistrationPage> {
        const parameters = new URLSearchParams({
            page: filter.page.toString(),
            pageSize: filter.pageSize.toString(),
        });

        if (filter.name?.trim()) {
            parameters.set("name", filter.name.trim());
        }

        if (filter.date) {
            parameters.set("date", filter.date);
        }

        const response = await request<RegistrationPage>(
            `/api/admin/registrations?${parameters.toString()}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            },
        );

        if (response === null) {
            throw new Error(
                "The registrations endpoint returned no response",
            );
        }

        if (!Array.isArray(response.items)) {
            throw new Error(
                "The registrations response does not contain an items array",
            );
        }

        return response;
    },

    async updateRegistration(
        id: string,
        registration: RegistrationUpdate,
    ): Promise<Registration> {
        const response = await request<Registration>(
            `/api/admin/registrations/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registration),
            },
        );

        if (response === null) {
            throw new Error(
                "The update endpoint returned no response",
            );
        }

        return response;
    },

    async deleteRegistration(
        id: string,
    ): Promise<void> {
        await request<unknown>(
            `/api/admin/registrations/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            },
        );
    },
};