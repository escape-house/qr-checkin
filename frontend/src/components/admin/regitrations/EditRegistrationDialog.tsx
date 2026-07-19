import type {
    Registration,
    RegistrationUpdate,
} from "../../../types/Registration.ts";

type EditRegistrationDialogProps = {
    registration: Registration;
    form: RegistrationUpdate;
    saving: boolean;
    error: string | null;
    onChange: (
        changes: Partial<RegistrationUpdate>,
    ) => void;
    onClose: () => void;
    onSave: () => void;
};

export function EditRegistrationDialog({
                                           registration,
                                           form,
                                           saving,
                                           error,
                                           onChange,
                                           onClose,
                                           onSave,
                                       }: EditRegistrationDialogProps) {
    return (
        <div
            className="registration-dialog-backdrop"
            role="presentation"
            onMouseDown={event => {
                if (
                    event.target === event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }
            }}
        >
            <section
                className="registration-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="registration-edit-title"
            >
                <header>
                    <div>
                        <p>Edit registration</p>

                        <h2 id="registration-edit-title">
                            {registration.firstName}{" "}
                            {registration.lastName}
                        </h2>
                    </div>

                    <button
                        type="button"
                        aria-label="Close"
                        disabled={saving}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>

                <form
                    className="registration-edit-form"
                    onSubmit={event => {
                        event.preventDefault();
                        onSave();
                    }}
                >
                    <div className="registration-edit-form__row">
                        <label>
                            <span>First name</span>

                            <input
                                type="text"
                                required
                                value={form.firstName}
                                onChange={event =>
                                    onChange({
                                        firstName:
                                        event.target.value,
                                    })
                                }
                            />
                        </label>

                        <label>
                            <span>Last name</span>

                            <input
                                type="text"
                                required
                                value={form.lastName}
                                onChange={event =>
                                    onChange({
                                        lastName:
                                        event.target.value,
                                    })
                                }
                            />
                        </label>
                    </div>

                    <label>
                        <span>Email</span>

                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={event =>
                                onChange({
                                    email: event.target.value,
                                })
                            }
                        />
                    </label>

                    <div className="registration-edit-form__row">
                        <label>
                            <span>Room</span>

                            <input
                                type="text"
                                required
                                value={form.roomName}
                                onChange={event =>
                                    onChange({
                                        roomName:
                                        event.target.value,
                                    })
                                }
                            />
                        </label>

                        <label>
                            <span>Slot ID</span>

                            <input
                                type="number"
                                required
                                min="1"
                                value={form.slotId}
                                onChange={event =>
                                    onChange({
                                        slotId: Number(
                                            event.target.value,
                                        ),
                                    })
                                }
                            />
                        </label>
                    </div>

                    <label className="registration-edit-form__checkbox">
                        <input
                            type="checkbox"
                            checked={
                                form.agreesToTermsAndCondition
                            }
                            onChange={event =>
                                onChange({
                                    agreesToTermsAndCondition:
                                    event.target.checked,
                                })
                            }
                        />

                        <span>
                            Agreed to terms and conditions
                        </span>
                    </label>

                    <label className="registration-edit-form__checkbox">
                        <input
                            type="checkbox"
                            checked={form.wantsPhotosOnline}
                            onChange={event =>
                                onChange({
                                    wantsPhotosOnline:
                                    event.target.checked,
                                })
                            }
                        />

                        <span>
                            Photos may be published online
                        </span>
                    </label>

                    {error && (
                        <p
                            className="registrations-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <footer>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}