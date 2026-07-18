import DataStatus from "../types/DataStatus.ts";
import { useCheckInSlots } from "../hooks/useCheckInSlots.ts";

export default function SlotsPage() {
    const {
        checkInSlots,
        checkInSlotsLoading,
        fetchCheckInSlots,
    } = useCheckInSlots();

    const isLoading =
        checkInSlotsLoading === DataStatus.LOADING;

    return (
        <section>
            <h1>Backend test</h1>

            <button
                type="button"
                onClick={fetchCheckInSlots}
                disabled={isLoading}
            >
                {isLoading
                    ? "Loading..."
                    : "Fetch check-in slots"}
            </button>

            {checkInSlotsLoading === DataStatus.ERROR && (
                <p role="alert">
                    Error
                </p>
            )}

            {checkInSlotsLoading === DataStatus.SUCCESS && (
                <>
                    <p>
                        Received {checkInSlots.length} slots.
                    </p>

                    <pre>
                        {JSON.stringify(checkInSlots, null, 2)}
                    </pre>
                </>
            )}
        </section>
    );
}