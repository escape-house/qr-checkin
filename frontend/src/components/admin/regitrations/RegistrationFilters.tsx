type RegistrationFiltersProps = {
    name: string;
    date: string;
    onNameChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onApply: () => void;
    onReset: () => void;
};

export function RegistrationFilters({
                                        name,
                                        date,
                                        onNameChange,
                                        onDateChange,
                                        onApply,
                                        onReset,
                                    }: RegistrationFiltersProps) {
    return (
        <section className="registration-filters">
            <form
                className="registration-filters__form"
                onSubmit={event => {
                    event.preventDefault();
                    onApply();
                }}
            >
                <label>
                    <span>Name</span>

                    <input
                        type="search"
                        value={name}
                        onChange={event =>
                            onNameChange(event.target.value)
                        }
                        placeholder="First or last name"
                    />
                </label>

                <label>
                    <span>Date</span>

                    <input
                        type="date"
                        value={date}
                        onChange={event =>
                            onDateChange(event.target.value)
                        }
                    />
                </label>

                <button type="submit">
                    Filter
                </button>

                <button
                    className="registration-filters__reset"
                    type="button"
                    onClick={onReset}
                >
                    Reset
                </button>
            </form>
        </section>
    );
}