import type {
    Registration,
    RegistrationUpdate,
} from "../types/Registration.ts";

export function registrationToUpdate(
    registration: Registration,
): RegistrationUpdate {
    return {
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        roomName: registration.roomName,
        slotId: registration.slotId,
        agreesToTermsAndCondition:
        registration.agreesToTermsAndCondition,
        wantsPhotosOnline:
        registration.wantsPhotosOnline,
    };
}

export function formatRegistrationDate(
    value: string,
): string {
    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})$/,
    );

    if (!match) {
        return value;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(
        Date.UTC(year, month - 1, day),
    );

    if (
        Number.isNaN(date.getTime()) ||
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return value;
    }

    return new Intl.DateTimeFormat("de-AT", {
        dateStyle: "medium",
        timeZone: "UTC",
    }).format(date);
}