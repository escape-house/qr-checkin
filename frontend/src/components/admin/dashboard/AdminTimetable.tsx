import {
    type CSSProperties,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type {
    AdminCheckInSlot,
} from "../../../types/AdminDashBoard.ts";
import {
    AdminSlotCard,
} from "./AdminSlotCard.tsx";

type AdminTimetableProps = {
    slots: AdminCheckInSlot[];
    now: Date;
    showPastSlots: boolean;
};

type RoomGroup = {
    roomName: string;
    allSlots: AdminCheckInSlot[];
    visibleSlots: AdminCheckInSlot[];
};

type Timeline = {
    start: Date;
    end: Date;
    durationMinutes: number;
    markers: Date[];
};

const TIME_STEP_MINUTES = 30;

/*
 * The timeline grows vertically by at least this amount
 * per minute.
 *
 * 30 minutes = 96px
 * 60 minutes = 192px
 */
const MIN_PIXELS_PER_MINUTE = 3.2;

/*
 * Even when only one short appointment remains, show
 * at least four hours on the timetable.
 */
const MIN_TIMELINE_DURATION_MINUTES = 240;

/*
 * Up to six rooms share the available width equally.
 * With more than six rooms, horizontal scrolling starts.
 */
const MAX_ROOMS_WITHOUT_SCROLL = 6;
const ROOM_COLUMN_MIN_WIDTH = 250;
const TIME_COLUMN_WIDTH = 76;

/*
 * Must match the CSS height of:
 *
 * .admin-timetable__corner
 * .admin-timetable__room-header
 */
const TIMETABLE_HEADER_HEIGHT = 190;

const SLOT_GAP_PIXELS = 8;
const MIN_SLOT_HEIGHT = 76;

function roomImageUrl(roomName: string): string {
    const fileName = roomName
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    return `/rooms/${fileName}.jpg`;
}

function formatTime(date: Date): string {
    return new Intl.DateTimeFormat("de-AT", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function minutesBetween(
    start: Date,
    end: Date,
): number {
    return (
        end.getTime() - start.getTime()
    ) / 60_000;
}

function floorToTimeStep(
    date: Date,
    stepMinutes: number,
): Date {
    const result = new Date(date);

    result.setSeconds(0, 0);

    result.setMinutes(
        Math.floor(
            result.getMinutes() / stepMinutes,
        ) * stepMinutes,
    );

    return result;
}

function ceilToTimeStep(
    date: Date,
    stepMinutes: number,
): Date {
    const flooredDate = floorToTimeStep(
        date,
        stepMinutes,
    );

    if (
        flooredDate.getTime() ===
        date.getTime()
    ) {
        return flooredDate;
    }

    return new Date(
        flooredDate.getTime() +
        stepMinutes * 60_000,
    );
}

function createTimeMarkers(
    start: Date,
    end: Date,
): Date[] {
    const markers: Date[] = [];

    const stepMilliseconds =
        TIME_STEP_MINUTES * 60_000;

    for (
        let timestamp = start.getTime();
        timestamp <= end.getTime();
        timestamp += stepMilliseconds
    ) {
        markers.push(new Date(timestamp));
    }

    return markers;
}

function createRoomGroups(
    slots: AdminCheckInSlot[],
    now: Date,
    showPastSlots: boolean,
): RoomGroup[] {
    const rooms =
        new Map<string, AdminCheckInSlot[]>();

    for (const slot of slots) {
        const roomName =
            slot.room?.trim() ||
            "Unknown room";

        const existingSlots =
            rooms.get(roomName) ?? [];

        existingSlots.push(slot);

        rooms.set(
            roomName,
            existingSlots,
        );
    }

    return Array.from(rooms.entries())
        .map(([roomName, roomSlots]) => {
            const sortedSlots = [...roomSlots].sort(
                (first, second) =>
                    first.start.getTime() -
                    second.start.getTime(),
            );

            const visibleSlots = showPastSlots
                ? sortedSlots
                : sortedSlots.filter(
                    slot =>
                        slot.end.getTime() >
                        now.getTime(),
                );

            return {
                roomName,
                allSlots: sortedSlots,
                visibleSlots,
            };
        })
        .sort((first, second) =>
            first.roomName.localeCompare(
                second.roomName,
                "de-AT",
            ),
        );
}

function createTimeline(
    visibleSlots: AdminCheckInSlot[],
    now: Date,
): Timeline {
    /*
     * When every past slot is hidden, use the current
     * time as the beginning instead of using old slots.
     */
    const earliestVisibleStart =
        visibleSlots.length > 0
            ? Math.min(
                ...visibleSlots.map(slot =>
                    slot.start.getTime(),
                ),
            )
            : now.getTime();

    const latestVisibleEnd =
        visibleSlots.length > 0
            ? Math.max(
                ...visibleSlots.map(slot =>
                    slot.end.getTime(),
                ),
            )
            : now.getTime();

    /*
     * Include the current time in the visible timeline.
     */
    const rawStart = new Date(
        Math.min(
            earliestVisibleStart,
            now.getTime(),
        ),
    );

    const start = floorToTimeStep(
        rawStart,
        TIME_STEP_MINUTES,
    );

    const minimumEnd = new Date(
        start.getTime() +
        MIN_TIMELINE_DURATION_MINUTES *
        60_000,
    );

    const rawEnd = new Date(
        Math.max(
            latestVisibleEnd,
            minimumEnd.getTime(),
        ),
    );

    const end = ceilToTimeStep(
        rawEnd,
        TIME_STEP_MINUTES,
    );

    return {
        start,
        end,
        durationMinutes:
            minutesBetween(start, end),
        markers:
            createTimeMarkers(start, end),
    };
}

export function AdminTimetable({
                                   slots,
                                   now,
                                   showPastSlots,
                               }: AdminTimetableProps) {
    const containerRef =
        useRef<HTMLElement | null>(null);

    const [
        containerHeight,
        setContainerHeight,
    ] = useState(0);

    /*
     * Measure the remaining available screen height.
     * ResizeObserver also reacts when the browser window
     * or dashboard header changes size.
     */
    useEffect(() => {
        const element = containerRef.current;

        if (!element) {
            return;
        }

        const updateHeight = (): void => {
            setContainerHeight(
                element.clientHeight,
            );
        };

        updateHeight();

        const observer =
            new ResizeObserver(updateHeight);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    /*
     * Room groups are always created from every slot.
     * Therefore, room columns remain visible when all
     * appointments inside a room are filtered out.
     */
    const roomGroups = useMemo(
        () =>
            createRoomGroups(
                slots,
                now,
                showPastSlots,
            ),
        [
            slots,
            now,
            showPastSlots,
        ],
    );

    const visibleSlots = useMemo(
        () =>
            roomGroups.flatMap(
                group => group.visibleSlots,
            ),
        [roomGroups],
    );

    const timeline = useMemo(
        () =>
            createTimeline(
                visibleSlots,
                now,
            ),
        [
            visibleSlots,
            now,
        ],
    );

    if (roomGroups.length === 0) {
        return (
            <p className="admin-dashboard-state">
                No rooms found.
            </p>
        );
    }

    /*
     * The timetable body should fill the remaining
     * viewport height below the room headers.
     */
    const availableBodyHeight = Math.max(
        0,
        containerHeight -
        TIMETABLE_HEADER_HEIGHT,
    );

    const calculatedTimelineHeight =
        timeline.durationMinutes *
        MIN_PIXELS_PER_MINUTE;

    const timelineBodyHeight = Math.max(
        calculatedTimelineHeight,
        availableBodyHeight,
    );

    /*
     * Recalculate the scale when the timetable is stretched
     * to fill more vertical screen space.
     */
    const pixelsPerMinute =
        timelineBodyHeight /
        timeline.durationMinutes;

    const roomsFitOnScreen =
        roomGroups.length <=
        MAX_ROOMS_WITHOUT_SCROLL;

    /*
     * Six or fewer rooms share the entire available width.
     * Seven or more rooms use fixed columns and horizontal
     * scrolling.
     */
    const roomColumns = roomsFitOnScreen
        ? `repeat(${roomGroups.length}, minmax(0, 1fr))`
        : `repeat(${roomGroups.length}, ${ROOM_COLUMN_MIN_WIDTH}px)`;

    const gridStyle: CSSProperties = {
        gridTemplateColumns:
            `${TIME_COLUMN_WIDTH}px ${roomColumns}`,

        width: "100%",

        minWidth: roomsFitOnScreen
            ? "100%"
            : TIME_COLUMN_WIDTH +
            roomGroups.length *
            ROOM_COLUMN_MIN_WIDTH,
    };

    const nowOffsetMinutes =
        minutesBetween(
            timeline.start,
            now,
        );

    const showCurrentTimeLine =
        nowOffsetMinutes >= 0 &&
        nowOffsetMinutes <=
        timeline.durationMinutes;

    return (
        <section
            ref={containerRef}
            className="admin-timetable-container"
        >
            <div
                className="admin-timetable"
                style={gridStyle}
            >
                <div className="admin-timetable__corner">
                    Uhrzeit
                </div>

                {roomGroups.map(group => (
                    <header
                        className="admin-timetable__room-header"
                        key={group.roomName}
                    >
                        <img
                            src={roomImageUrl(
                                group.roomName,
                            )}
                            alt={`${group.roomName} Cover`}
                            onError={event => {
                                event.currentTarget.onerror =
                                    null;

                                event.currentTarget.src =
                                    "/rooms/placeholder.jpg";
                            }}
                        />

                        <div>
                            <span>Raum</span>

                            <strong className={"admin-slot-card__room-name"}>
                                {group.roomName}
                            </strong>
                        </div>
                    </header>
                ))}

                <aside
                    className="admin-timetable__time-axis"
                    style={{
                        height:
                        timelineBodyHeight,
                    }}
                >
                    {timeline.markers.map(marker => {
                        const top =
                            minutesBetween(
                                timeline.start,
                                marker,
                            ) *
                            pixelsPerMinute;

                        return (
                            <div
                                className="admin-timetable__time-marker"
                                key={
                                    marker.toISOString()
                                }
                                style={{ top }}
                            >
                                <span>
                                    {formatTime(marker)}
                                </span>
                            </div>
                        );
                    })}

                    {showCurrentTimeLine && (
                        <div
                            className="admin-timetable__now-label"
                            style={{
                                top:
                                    nowOffsetMinutes *
                                    pixelsPerMinute,
                            }}
                        >
                            Jetzt
                        </div>
                    )}
                </aside>

                {roomGroups.map(group => (
                    <section
                        className="admin-timetable__room-column"
                        key={group.roomName}
                        style={{
                            height:
                            timelineBodyHeight,
                        }}
                        aria-label={
                            `Termine für ${group.roomName}`
                        }
                    >
                        {timeline.markers.map(marker => {
                            const top =
                                minutesBetween(
                                    timeline.start,
                                    marker,
                                ) *
                                pixelsPerMinute;

                            return (
                                <div
                                    className="admin-timetable__grid-line"
                                    key={
                                        marker.toISOString()
                                    }
                                    style={{ top }}
                                />
                            );
                        })}

                        {showCurrentTimeLine && (
                            <div
                                className="admin-timetable__now-line"
                                style={{
                                    top:
                                        nowOffsetMinutes *
                                        pixelsPerMinute,
                                }}
                            />
                        )}

                        {group.visibleSlots.length ===
                            0 && (
                                <p className="admin-timetable__empty-room">
                                    Keine aktuellen Termine
                                </p>
                            )}

                        {group.visibleSlots.map(
                            (slot, index) => {
                                const top =
                                    minutesBetween(
                                        timeline.start,
                                        slot.start,
                                    ) *
                                    pixelsPerMinute;

                                const slotDurationMinutes =
                                    Math.max(
                                        1,
                                        minutesBetween(
                                            slot.start,
                                            slot.end,
                                        ),
                                    );

                                const height = Math.max(
                                    MIN_SLOT_HEIGHT,
                                    slotDurationMinutes *
                                    pixelsPerMinute -
                                    SLOT_GAP_PIXELS,
                                );

                                const isPast =
                                    slot.end.getTime() <=
                                    now.getTime();

                                const className = [
                                    "admin-timetable__slot",
                                    isPast
                                        ? "admin-timetable__slot--past"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ");

                                return (
                                    <div
                                        className={
                                            className
                                        }
                                        key={
                                            slot.id ??
                                            `${group.roomName}-${slot.start.toISOString()}-${index}`
                                        }
                                        style={{
                                            top,
                                            height,
                                        }}
                                    >
                                        <AdminSlotCard
                                            slot={slot}
                                            timetable
                                            now={now}
                                        />
                                    </div>
                                );
                            },
                        )}
                    </section>
                ))}
            </div>
        </section>
    );
}