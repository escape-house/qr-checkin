import type { Slot } from "../types/Slot.ts";
import { NavLink } from "react-router-dom";
import "./SlotCard.css";

type SlotProps = {
    slot: Slot;
};

function roomImageUrl(roomName: string): string {
    const fileName = roomName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    return `/rooms/${fileName}.jpg`;
}

function formatTime(start: string | Date): string {
    const date = start instanceof Date
        ? start
        : new Date(start);

    if (Number.isNaN(date.getTime())) {
        return "--:--";
    }

    return new Intl.DateTimeFormat("de-AT", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

export function SlotCard({ slot }: SlotProps) {
    const customerName =
        slot.companyName ||
        slot.name ||
        "";
    const playerCountText =
        slot.players === 1 ? "" : slot.players?.toString();

    return (
        <article className="slot-card">
            <div className="slot-card__image-container">
                <img
                    className="slot-card__image"
                    src={roomImageUrl(slot.room)}
                    alt={`${slot.room} Cover`}
                    onError={(event) => {
                        event.currentTarget.src =
                            "/rooms/placeholder.jpg";
                    }}
                />

                <span className="slot-card__time">
                    {formatTime(slot.start)}
                </span>
            </div>

            <div className="slot-card__content">
                <div className="slot-card__header">
                    <div>
                        <p className="slot-card__room">
                            {slot.room}
                        </p>

                        <h2 className="slot-card__customer">
                            {customerName}
                        </h2>
                    </div>

                    {slot.players != null && (
                        <span className="slot-card__players">
                            {playerCountText}
                            <span aria-hidden="true"> × </span>
                            <span className="slot-card__players-label">
                                Spieler
                            </span>
                        </span>
                    )}
                </div>

                <NavLink
                    className="slot-card__button"
                    to={`/checkIn/${encodeURIComponent(slot.id)}`}
                >
                    Check-in öffnen
                </NavLink>
            </div>
        </article>
    );
}