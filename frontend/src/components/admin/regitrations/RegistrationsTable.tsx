import type {
    Registration,
} from "../../../types/Registration.ts";
import {formatRegistrationDate} from "../../../utils/registrationUtil.ts";

type RegistrationsTableProps = {
    registrations: Registration[];
    loading: boolean;
    deletingId: string | null;
    onEdit: (registration: Registration) => void;
    onDelete: (registration: Registration) => void;
};

export function RegistrationsTable({
                                       registrations,
                                       loading,
                                       deletingId,
                                       onEdit,
                                       onDelete,
                                   }: RegistrationsTableProps) {
    if (loading) {
        return (
            <p className="registrations-state">
                Loading registrations...
            </p>
        );
    }

    if (registrations.length === 0) {
        return (
            <p className="registrations-state">
                No registrations found.
            </p>
        );
    }

    return (
        <div className="registrations-table-wrapper">
            <table className="registrations-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Room</th>
                    <th>Slot</th>
                    <th>Registration date</th>
                    <th>Terms</th>
                    <th>Photos</th>
                    <th>
                            <span className="sr-only">
                                Actions
                            </span>
                    </th>
                </tr>
                </thead>

                <tbody>
                {registrations.map(registration => (
                    <tr key={registration.id}>
                        <td>
                            <strong>
                                {registration.firstName}{" "}
                                {registration.lastName}
                            </strong>
                        </td>

                        <td>
                            <a
                                href={`mailto:${registration.email}`}
                            >
                                {registration.email}
                            </a>
                        </td>

                        <td>
                            {registration.roomName}
                        </td>

                        <td>
                            {registration.slotId}
                        </td>

                        <td>
                            {formatRegistrationDate(
                                registration.registrationDate,
                            )}
                        </td>

                        <td>
                            {registration
                                .agreesToTermsAndCondition
                                ? "Yes"
                                : "No"}
                        </td>

                        <td>
                            {registration.wantsPhotosOnline
                                ? "Yes"
                                : "No"}
                        </td>

                        <td>
                            <div className="registration-actions">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(registration)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="registration-actions__delete"
                                    type="button"
                                    disabled={
                                        deletingId ===
                                        registration.id
                                    }
                                    onClick={() =>
                                        onDelete(registration)
                                    }
                                >
                                    {deletingId ===
                                    registration.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}