import {NavLink, useParams} from "react-router-dom";
import DataStatus from "../types/DataStatus.ts";
import { useCheckInSlots } from "../hooks/useCheckInSlots.ts";
import {
    type ChangeEvent,
    type SubmitEvent,
    useEffect,
    useState,
} from "react";
import {checkInApi} from "../service/BackendApiService.ts";
import "./Checkin.css";
import type {CheckInForm} from "../types/CheckInForm.ts";

type SubmitStatus =
    | "idle"
    | "submitting"
    | "success"
    | "error";

const initialForm: CheckInForm = {
    firstName: "",
    lastName: "",
    email: "",
    agreesToTermsAndCondition: false,
    wantsPhotosOnline: false,
};

function Checkin() {
    const { slotId } = useParams<{ slotId: string }>();

    const {
        checkInSlots,
        checkInSlotsLoading,
        fetchCheckInSlots,
    } = useCheckInSlots();

    const [form, setForm] = useState<CheckInForm>(initialForm);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (checkInSlotsLoading === DataStatus.NO_STATUS) {
            void fetchCheckInSlots();
        }
    }, [checkInSlotsLoading, fetchCheckInSlots]);

    const numericSlotId = Number(slotId);

    const slot = Number.isNaN(numericSlotId)
        ? undefined
        : checkInSlots.find(
            currentSlot => currentSlot.id === numericSlotId,
        );

    function handleTextChange(
        event: ChangeEvent<HTMLInputElement>,
    ): void {
        const { name, value } = event.target;

        setForm(previousForm => ({
            ...previousForm,
            [name]: value,
        }));
    }

    function handleCheckboxChange(
        event: ChangeEvent<HTMLInputElement>,
    ): void {
        const { name, checked } = event.target;

        setForm(previousForm => ({
            ...previousForm,
            [name]: checked,
        }));
    }

    function checkInAnotherPlayer(): void {
        setForm(initialForm);
        setSubmitError(null);
        setSubmitStatus("idle");
    }

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        if (!slot) {
            setSubmitStatus("error");
            setSubmitError("The selected slot was not found.");
            return;
        }
        if (!form.agreesToTermsAndCondition) {
            setSubmitStatus("error");
            setSubmitError(
                "You must agree to the terms and conditions.",
            );
            return;
        }

        setSubmitStatus("submitting");
        setSubmitError(null);

        try {
            await checkInApi.submitCheckIn(
                slot.room,
                slot.id,
                form,
            );

            setSubmitStatus("success");
        } catch (error) {
            setSubmitStatus("error");

            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError(
                    "An unknown error occurred during check-in.",
                );
            }
        }
    }

    if (checkInSlotsLoading === DataStatus.NO_STATUS || checkInSlotsLoading === DataStatus.LOADING) {
        return <p>Loading slot...</p>;
    }
    if (checkInSlotsLoading === DataStatus.ERROR) {
        return <p>Could not load the slot.</p>;
    }
    if (!slot) {
        return <p>Slot {slotId} was not found.</p>;
    }
    if (submitStatus === "success") {
        return (
            <main className="checkin-page">
                <section className="checkin-success">
                <span
                    className="checkin-success__icon"
                    aria-hidden="true"
                >
                    ✓
                </span>
                    <h1>Check-in successful</h1>
                    <p>
                        Thank you, {form.firstName}. Your check-in for{" "}
                        <strong>{slot.room}</strong> has been completed.
                    </p>
                    <button
                        className="checkin-success__button"
                        type="button"
                        onClick={checkInAnotherPlayer}
                    >
                        Check in another player
                    </button>
                </section>
            </main>
        );
    }

    const customer =
        slot.companyName?.trim() ||
        slot.name?.trim() ||
        ""

    const startTime = slot.start.toLocaleTimeString(
        "de-AT",
        {
            hour: "2-digit",
            minute: "2-digit",
        },
    );

    return (
        <main className="checkin-page">
            <NavLink
                className="checkin-page__back-link"
                to="/"
            >
                <span aria-hidden="true">←</span>
                Check in for another slot
            </NavLink>            <section className="checkin-card">
                <header className="checkin-card__header">
                    <div>
                        <p className="checkin-card__label">
                            Check-in
                        </p>

                        <h1>{slot.room}</h1>

                        <p className="checkin-card__customer">
                            {customer}
                        </p>
                    </div>

                    <div className="checkin-card__time">
                        {startTime}
                    </div>
                </header>

                <div className="checkin-card__details">
                    <span>
                        {slot.players ?? "?"} players
                    </span>

                    <span>Slot #{slot.id}</span>
                </div>

                <form
                    className="checkin-form"
                    onSubmit={handleSubmit}
                >
                    <div className="checkin-form__row">
                        <label className="checkin-form__field">
                            <span>First name</span>

                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleTextChange}
                                autoComplete="given-name"
                                required
                            />
                        </label>

                        <label className="checkin-form__field">
                            <span>Last name</span>

                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleTextChange}
                                autoComplete="family-name"
                                required
                            />
                        </label>
                    </div>

                    <label className="checkin-form__field">
                        <span>Email address</span>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleTextChange}
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="checkin-form__checkbox">
                        <input
                            type="checkbox"
                            name="agreesToTermsAndCondition"
                            checked={
                                form.agreesToTermsAndCondition
                            }
                            onChange={handleCheckboxChange}
                            required
                        />

                        <span>
                            I agree to the terms and conditions.
                        </span>
                    </label>

                    <label className="checkin-form__checkbox">
                        <input
                            type="checkbox"
                            name="wantsPhotosOnline"
                            checked={form.wantsPhotosOnline}
                            onChange={handleCheckboxChange}
                        />

                        <span>
                            The photos of our group may be
                            published online.
                        </span>
                    </label>

                    {submitStatus === "error" && (
                        <p
                            className="checkin-form__error"
                            role="alert"
                        >
                            {submitError}
                        </p>
                    )}

                    <button
                        className="checkin-form__submit"
                        type="submit"
                        disabled={
                            submitStatus === "submitting"
                        }
                    >
                        {submitStatus === "submitting"
                            ? "Checking in..."
                            : "Complete check-in"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Checkin;