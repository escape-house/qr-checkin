import DataStatus from "../types/DataStatus.ts";
import { useCheckInSlots } from "../hooks/useCheckInSlots.ts";
import { useEffect } from "react";
import { SlotCard } from "../components/SlotCard.tsx";
import type { Slot } from "../types/Slot.ts";
import "./SlotPage.css";

function isBooked(slot: Slot): boolean {
    return Boolean(
        slot.name?.trim() ||
        slot.companyName?.trim()
    );
}

export default function SlotsPage() {
    const {
        checkInSlots,
        checkInSlotsLoading,
        fetchCheckInSlots,
    } = useCheckInSlots();

    useEffect(() => {
        void fetchCheckInSlots();
    }, [fetchCheckInSlots]);

    const bookedSlots = checkInSlots.filter(isBooked);
    const availableSlots = checkInSlots.filter(
        slot => !isBooked(slot),
    );

    return (
        <section>
            <h1>Check In</h1>

            {checkInSlotsLoading === DataStatus.LOADING && (
                <p>Loading...</p>
            )}

            {checkInSlotsLoading === DataStatus.ERROR && (
                <p>Error</p>
            )}

            {checkInSlotsLoading === DataStatus.SUCCESS && (
                <>
                    <div className="slot-grid">
                        {bookedSlots.map(slot => (
                            <SlotCard
                                key={slot.id}
                                slot={slot}
                            />
                        ))}
                    </div>

                    <h3>More:</h3>

                    <div className="slot-grid">
                        {availableSlots.map(slot => (
                            <SlotCard
                                key={slot.id}
                                slot={slot}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}