import {useQuery} from "@tanstack/react-query"
import {useNavigate} from "react-router-dom"
import {fetchRooms} from "../api/checkInApi.ts"
import {SlotUtils} from "../util/SlotUtil.ts"

function AllRoomsPage() {
    const navigate = useNavigate()
    const {data: rooms, isPending, isError} = useQuery({
        queryKey: ["rooms"],
        queryFn: fetchRooms,
    })

    return (
        <div className="max-w-lg mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate("/")}
                    aria-label="Zurück"
                    className="text-text-secondary hover:text-text transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                </button>
                <h1 className="text-2xl font-bold">Checkin</h1>
            </div>

            {isPending && <p className="text-text-secondary">Lade Räume…</p>}
            {isError && <p className="text-error">Fehler beim Laden der Räume.</p>}
            {rooms?.length === 0 && <p className="text-text-secondary">Keine Räume heute.</p>}

            {rooms?.map(room => (
                <div
                    key={room}
                    className="border border-border rounded-[--radius-lg] overflow-hidden mb-3 cursor-pointer bg-surface hover:border-primary transition-colors"

                    onClick={() => navigate(`/rooms/${encodeURIComponent(room.replace(" ", "_"))}`)}
                >
                    <img
                        src={SlotUtils.getRoomImageUrl(room)}
                        alt={room}
                        className="w-full object-cover h-40"
                    />
                    <div className="px-4 py-3 font-semibold text-lg">{room}</div>
                </div>
            ))}
        </div>
    )
}

export default AllRoomsPage
