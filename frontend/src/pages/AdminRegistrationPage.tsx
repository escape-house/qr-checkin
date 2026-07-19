import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    NavLink,
    useNavigate,
} from "react-router-dom";
import {
    HttpError,
    registrationApi,
} from "../service/BackendApiService.ts";
import type {
    Registration,
    RegistrationPage,
    RegistrationUpdate,
} from "../types/Registration.ts";
import "./AdminRegistrationPage.css";
import {RegistrationFilters} from "../components/admin/regitrations/RegistrationFilters.tsx";
import {EditRegistrationDialog} from "../components/admin/regitrations/EditRegistrationDialog.tsx";
import {RegistrationsPagination} from "../components/admin/regitrations/RegistrationsPagination.tsx";
import {RegistrationsTable} from "../components/admin/regitrations/RegistrationsTable.tsx";
import {registrationToUpdate} from "../utils/registrationUtil.ts";

const PAGE_SIZE = 20;

const emptyPage: RegistrationPage = {
    items: [],
    page: 0,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
};

export default function AdminRegistrationsPage() {
    const navigate = useNavigate();

    const [registrations, setRegistrations] =
        useState<RegistrationPage>(emptyPage);

    const [page, setPage] = useState(0);

    const [nameInput, setNameInput] = useState("");
    const [dateInput, setDateInput] = useState("");

    const [nameFilter, setNameFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] =
        useState<string | null>(null);

    const [deletingId, setDeletingId] =
        useState<string | null>(null);

    const [
        editingRegistration,
        setEditingRegistration,
    ] = useState<Registration | null>(null);

    const [editForm, setEditForm] =
        useState<RegistrationUpdate | null>(null);

    const [saving, setSaving] = useState(false);
    const [editError, setEditError] =
        useState<string | null>(null);

    const redirectToLogin = useCallback(() => {
        navigate("/admin", {
            replace: true,
            state: {
                redirectTo: "/admin/registrations",
            },
        });
    }, [navigate]);

    const handleRequestError = useCallback(
        (
            requestError: unknown,
            fallbackMessage: string,
        ): string | null => {
            if (
                requestError instanceof HttpError &&
                requestError.status === 401
            ) {
                redirectToLogin();
                return null;
            }

            return requestError instanceof Error
                ? requestError.message
                : fallbackMessage;
        },
        [redirectToLogin],
    );

    const loadRegistrations = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await registrationApi.fetchRegistrations({
                    page,
                    pageSize: PAGE_SIZE,
                    name: nameFilter,
                    date: dateFilter,
                });

            setRegistrations(response);
        } catch (requestError) {
            setError(
                handleRequestError(
                    requestError,
                    "Could not load registrations",
                ),
            );
        } finally {
            setLoading(false);
        }
    }, [
        dateFilter,
        handleRequestError,
        nameFilter,
        page,
    ]);

    useEffect(() => {
        void loadRegistrations();
    }, [loadRegistrations]);

    function openEditDialog(
        registration: Registration,
    ): void {
        setEditingRegistration(registration);
        setEditForm(
            registrationToUpdate(registration),
        );
        setEditError(null);
    }

    function closeEditDialog(): void {
        if (saving) {
            return;
        }

        setEditingRegistration(null);
        setEditForm(null);
        setEditError(null);
    }

    async function saveRegistration(): Promise<void> {
        if (!editingRegistration || !editForm) {
            return;
        }

        setSaving(true);
        setEditError(null);

        try {
            const updated =
                await registrationApi.updateRegistration(
                    editingRegistration.id,
                    editForm,
                );

            setRegistrations(current => ({
                ...current,
                items: current.items.map(registration =>
                    registration.id === updated.id
                        ? updated
                        : registration,
                ),
            }));

            /*
             * Do not call closeEditDialog() here because saving
             * is still true and that function intentionally blocks.
             */
            setEditingRegistration(null);
            setEditForm(null);
        } catch (requestError) {
            setEditError(
                handleRequestError(
                    requestError,
                    "Could not update registration",
                ),
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteRegistration(
        registration: Registration,
    ): Promise<void> {
        const fullName =
            `${registration.firstName} ${registration.lastName}`
                .trim();

        const confirmed = window.confirm(
            `Delete the registration for ${
                fullName || registration.email
            }?`,
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(registration.id);
        setError(null);

        try {
            await registrationApi.deleteRegistration(
                registration.id,
            );

            if (
                registrations.items.length === 1 &&
                page > 0
            ) {
                setPage(current => current - 1);
            } else {
                await loadRegistrations();
            }
        } catch (requestError) {
            setError(
                handleRequestError(
                    requestError,
                    "Could not delete registration",
                ),
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <main className="registrations-page">
            <header className="registrations-header">
                <div>
                    <NavLink
                        className="registrations-header__back"
                        to="/admin"
                    >
                        ← Admin
                    </NavLink>

                    <p className="registrations-header__label">
                        Administration
                    </p>

                    <h1>Registrations</h1>
                </div>

                <div className="registrations-header__count">
                    {registrations.totalItems}
                    <span> registrations</span>
                </div>
            </header>

            <RegistrationFilters
                name={nameInput}
                date={dateInput}
                onNameChange={setNameInput}
                onDateChange={setDateInput}
                onApply={() => {
                    setPage(0);
                    setNameFilter(nameInput.trim());
                    setDateFilter(dateInput);
                }}
                onReset={() => {
                    setNameInput("");
                    setDateInput("");
                    setNameFilter("");
                    setDateFilter("");
                    setPage(0);
                }}
            />

            {error && (
                <p
                    className="registrations-error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            <section className="registrations-table-card">
                <RegistrationsTable
                    registrations={registrations.items}
                    loading={loading}
                    deletingId={deletingId}
                    onEdit={openEditDialog}
                    onDelete={registration =>
                        void deleteRegistration(registration)
                    }
                />

                <RegistrationsPagination
                    page={page}
                    pageSize={registrations.pageSize}
                    totalItems={registrations.totalItems}
                    totalPages={registrations.totalPages}
                    currentItemCount={
                        registrations.items.length
                    }
                    loading={loading}
                    onPageChange={setPage}
                />
            </section>

            {editingRegistration && editForm && (
                <EditRegistrationDialog
                    registration={editingRegistration}
                    form={editForm}
                    saving={saving}
                    error={editError}
                    onChange={changes =>
                        setEditForm(current =>
                            current
                                ? {
                                    ...current,
                                    ...changes,
                                }
                                : current,
                        )
                    }
                    onClose={closeEditDialog}
                    onSave={() =>
                        void saveRegistration()
                    }
                />
            )}
        </main>
    );
}