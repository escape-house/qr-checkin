export interface AdminRegisteredPlayerDto {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    agreesToTermsAndCondition: boolean;
    wantsPhotosOnline: boolean;
    roomName?: string;
    slotId?: number;
    registrationDate?: string;
}

export interface AdminCheckInSlotDto {
    id: number | null;
    start: string;
    end: string;
    players: number | null;
    name: string | null;
    companyName: string | null;
    room: string | null;
    checkedInPlayers: AdminRegisteredPlayerDto[];
    type: string;
}

export interface AdminCheckInSlot {
    id: number | null;
    start: Date;
    end: Date;
    players: number | null;
    name: string | null;
    companyName: string | null;
    room: string | null;
    checkedInPlayers: AdminRegisteredPlayerDto[];
    type: string;
}