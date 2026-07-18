import type { Slot } from "../types/Slot.ts";

class HttpError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly responseBody: string,
    ) {
        super(message);
        this.name = "HttpError";
    }
}

async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new HttpError(
            `Request failed with status ${response.status}`,
            response.status,
            responseText,
        );
    }

    if (!responseText) {
        throw new Error(`Empty response received from ${url}`);
    }

    try {
        return JSON.parse(responseText) as T;
    } catch {
        throw new Error(`Invalid JSON received from ${url}`);
    }
}

export const checkInApi = {
    fetchCheckInSlots(): Promise<Slot[]> {
        return getJson<Slot[]>("/api/quinbook/checkInSlots");
    },
};