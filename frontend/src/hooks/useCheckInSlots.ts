import { useCallback, useState } from "react";
import DataStatus from "../types/DataStatus.ts";
import type { Slot } from "../types/Slot.ts";
import {checkInApi} from "../service/BackendApiService.ts";

export function useCheckInSlots() {
    const [checkInSlotsLoading, setCheckInSlotsLoading] = useState(DataStatus.NO_STATUS);
    const [checkInSlots, setCheckInSlots] = useState<Slot[]>([]);

    const fetchCheckInSlots = useCallback(async (): Promise<void> => {
        setCheckInSlotsLoading(DataStatus.LOADING);
        try {
            const slots = await checkInApi.fetchCheckInSlots();
            setCheckInSlots(slots);
            setCheckInSlotsLoading(DataStatus.SUCCESS);
        } catch (error) {
            //TODO: Snackbar error
            console.error(error)
            setCheckInSlotsLoading(DataStatus.ERROR);
        }
    }, []);

    return {
        checkInSlots,
        checkInSlotsLoading,
        fetchCheckInSlots,
    };
}