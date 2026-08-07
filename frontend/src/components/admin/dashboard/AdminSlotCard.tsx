import {
    RegisteredPlayerRow,
} from "./RegisteredPlayerRow.tsx";
import type {
    AdminCheckInSlot,
} from "../../../types/AdminDashBoard.ts";

type AdminSlotCardProps = {
    slot: AdminCheckInSlot;
    now: Date;
    timetable?: boolean;
};

const SOON_WINDOW_MINUTES = 60;

function formatTime(date: Date): string {
    return new Intl.DateTimeFormat("de-AT", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function cleanBookingValue(
    value: string | null | undefined,
): string {
    const cleaned = value?.trim() ?? "";

    if (
        /^(null|undefined)(\s+(null|undefined))*$/i
            .test(cleaned)
    ) {
        return "";
    }

    return cleaned;
}

export function AdminSlotCard({
                                  slot,
                                  now,
                                  timetable = false,
                              }: AdminSlotCardProps) {
    const registeredCount =
        slot.checkedInPlayers.length;

    const expectedPlayers = slot.players;

    const isBlocked =
        slot.type?.trim().toLowerCase() ===
        "block";

    const nowTimestamp = now.getTime();
    const startTimestamp = slot.start.getTime();
    const endTimestamp = slot.end.getTime();

    const isPlaying =
        !isBlocked &&
        nowTimestamp >= startTimestamp &&
        nowTimestamp < endTimestamp;

    const millisecondsUntilStart =
        startTimestamp - nowTimestamp;

    const isStartingSoon =
        !isBlocked &&
        !isPlaying &&
        millisecondsUntilStart > 0 &&
        millisecondsUntilStart <=
        SOON_WINDOW_MINUTES * 60_000;

    const minutesUntilStart = Math.max(
        1,
        Math.ceil(
            millisecondsUntilStart / 60_000,
        ),
    );

    const bookingName = isBlocked
        ? "Blocked"
        : (
            cleanBookingValue(slot.companyName) ||
            cleanBookingValue(slot.name)
        );

    const checkInProgress =
        expectedPlayers !== null &&
        expectedPlayers > 0
            ? Math.min(
                100,
                Math.round(
                    registeredCount /
                    expectedPlayers *
                    100,
                ),
            )
            : registeredCount > 0
                ? 100
                : 0;

    const allPlayersRegistered =
        !isBlocked &&
        expectedPlayers !== null &&
        expectedPlayers > 0 &&
        registeredCount >= expectedPlayers;

    /*
     * Blocked slots hide the whole player area until
     * somebody has nevertheless checked in.
     */
    const showPlayersSection =
        !isBlocked || registeredCount > 0;

    const cardClassName = [
        "admin-slot-card",

        timetable
            ? "admin-slot-card--timetable"
            : "",

        isBlocked
            ? "admin-slot-card--blocked"
            : "",

        isPlaying
            ? "admin-slot-card--playing"
            : "",

        isStartingSoon
            ? "admin-slot-card--soon"
            : "",

        allPlayersRegistered
            ? "admin-slot-card--complete"
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <article className={cardClassName}>
            <header className="admin-slot-card__header">
                <div className="admin-slot-card__title">
                    {!timetable && (
                        <p className="admin-slot-card__room">
                            {slot.room ?? ""}
                        </p>
                    )}

                    <h2
                        className={
                            isBlocked
                                ? "admin-slot-card__booking-name admin-slot-card__booking-name--blocked"
                                : "admin-slot-card__booking-name"
                        }
                    >
                        {bookingName}
                    </h2>

                    <div className="admin-slot-card__status-row">
                        {isBlocked && (
                            <span className="admin-slot-status admin-slot-status--blocked">
                                Blockiert
                            </span>
                        )}

                        {isPlaying && (
                            <span className="admin-slot-status admin-slot-status--playing">
                                Läuft gerade
                            </span>
                        )}

                        {isStartingSoon && (
                            <span className="admin-slot-status admin-slot-status--soon">
                                Start in {minutesUntilStart} Min.
                            </span>
                        )}

                        {allPlayersRegistered &&
                            !isPlaying &&
                            !isStartingSoon && (
                                <span className="admin-slot-status admin-slot-status--complete">
                                Check-in vollständig
                            </span>
                            )}
                    </div>
                </div>

                <time
                    className="admin-slot-card__time"
                    dateTime={slot.start.toISOString()}
                >
                    {formatTime(slot.start)}
                </time>
            </header>

            {!isBlocked && (
                <section className="admin-slot-card__checkin-progress">
                    <div className="admin-slot-card__progress-label">
                        <span>Check-in</span>

                        <strong>
                            {registeredCount}
                            {expectedPlayers !== null
                                ? ` / ${expectedPlayers}`
                                : ""}
                        </strong>
                    </div>

                    <div
                        className="admin-slot-card__progress"
                        role="progressbar"
                        aria-label="Eingecheckte Spieler"
                        aria-valuenow={registeredCount}
                        aria-valuemin={0}
                        aria-valuemax={
                            expectedPlayers ??
                            Math.max(
                                registeredCount,
                                1,
                            )
                        }
                    >
                        <div
                            className="admin-slot-card__progress-value"
                            style={{
                                width:
                                    `${checkInProgress}%`,
                            }}
                        />
                    </div>
                </section>
            )}

            {showPlayersSection && (
                <section className="admin-slot-card__players">
                    {registeredCount === 0 ? (
                        <p className="admin-slot-card__empty">
                            Noch niemand eingecheckt
                        </p>
                    ) : (
                        <>
                            {isBlocked && (
                                <p className="admin-slot-card__blocked-warning">
                                    Check-in trotz Blockierung
                                </p>
                            )}

                            <ul className="registered-player-grid">
                                {slot.checkedInPlayers.map(
                                    (player, index) => (
                                        <RegisteredPlayerRow
                                            key={
                                                player.id ??
                                                `${player.email}-${index}`
                                            }
                                            player={player}
                                        />
                                    ),
                                )}
                            </ul>
                        </>
                    )}
                </section>
            )}
        </article>
    );
}