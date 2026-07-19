export interface Registration {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roomName: string;
    slotId: number;
    registrationDate: string;

    agreesToTermsAndCondition: boolean;
    wantsPhotosOnline: boolean;
}

export interface RegistrationPage {
    items: Registration[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface RegistrationUpdate {
    firstName: string;
    lastName: string;
    email: string;
    roomName: string;
    slotId: number;
    agreesToTermsAndCondition: boolean;
    wantsPhotosOnline: boolean;
}

export interface RegistrationFilter {
    page: number;
    pageSize: number;
    name?: string;
    date?: string;
}