import type {
    Slot,
    SlotDto,
} from "../types/Slot.ts";
import type {CheckInForm} from "../types/CheckInForm.ts";

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