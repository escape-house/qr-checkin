import type {
    AdminRegisteredPlayerDto,
} from "../../../types/AdminDashBoard.ts";

type RegisteredPlayerRowProps = {
    player: AdminRegisteredPlayerDto;
};

export function RegisteredPlayerRow({
                                        player,
                                    }: RegisteredPlayerRowProps) {
    const fullName =
        `${player.firstName} ${player.lastName}`.trim();

    return (
        <li
            className="registered-player-chip"
            title={player.email}
        >
            <span className="registered-player-chip__name">
                {fullName || "Unbekannter Spieler"}
            </span>

            <span
                className={
                    player.wantsPhotosOnline
                        ? "registered-player-chip__photo registered-player-chip__photo--allowed"
                        : "registered-player-chip__photo registered-player-chip__photo--denied"
                }
            >
                {player.wantsPhotosOnline
                    ? "Foto ✓"
                    : "Foto ✕"}
            </span>
        </li>
    );
}