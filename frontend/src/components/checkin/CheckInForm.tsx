import {useState} from "react"
import {useMutation} from "@tanstack/react-query"
import type {CheckInSlot} from "../../types/Slot.ts"
import {postCheckIn, type CheckInFormData} from "../../api/checkInApi.ts"
import SlotInfo from "./SlotInfo.tsx"
import {Button} from "../ui/Button.tsx"
import {FormField} from "../ui/FormField.tsx"
import {Checkbox} from "../ui/Checkbox.tsx"
import {useNavigate} from "react-router-dom";

const emptyForm: CheckInFormData = {
    firstName: "",
    lastName: "",
    email: "",
    agreesToTermsAndCondition: false,
    wantsPhotosOnline: false,
}

type Props = {
    slot: CheckInSlot
    onSuccess: () => void
}

function CheckInForm({slot, onSuccess}: Props) {
    const [form, setForm] = useState<CheckInFormData>(emptyForm)
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: () => postCheckIn(slot.room!, slot.id ?? null, form),
        onSuccess,
    })

    const emailValid = form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    const canSubmit = form.firstName.trim() !== "" && form.lastName.trim() !== "" && form.agreesToTermsAndCondition && emailValid

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (canSubmit) mutation.mutate()
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate("/")}
                    aria-label="Zurück"
                    className="text-[--color-text-secondary] hover:text-[--color-text] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                </button>
                <h1 className="text-2xl font-bold">Zurück</h1>
            </div>
            <SlotInfo slot={slot}/>

            <div className="flex gap-3">
                <FormField
                    label="Vorname"
                    required
                    value={form.firstName}
                    onChange={e => setForm(f => ({...f, firstName: e.target.value}))}
                    wrapperClassName="flex-1"
                />
                <FormField
                    label="Nachname"
                    required
                    value={form.lastName}
                    onChange={e => setForm(f => ({...f, lastName: e.target.value}))}
                    wrapperClassName="flex-1"
                />
            </div>

            <FormField
                label="E-Mail"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                error={!emailValid ? "Bitte gib eine gültige E-Mail-Adresse ein." : undefined}
            />

            <Checkbox
                required
                checked={form.agreesToTermsAndCondition}
                onChange={e => setForm(f => ({...f, agreesToTermsAndCondition: e.target.checked}))}
            >
                Ich stimme den{" "}
                <a href="/agb" target="_blank" rel="noreferrer" className="text-[--color-primary] underline">
                    Allgemeinen Geschäftsbedingungen
                </a>{" "}
                zu. <span className="text-[--color-error]">*</span>
            </Checkbox>

            <Checkbox
                checked={form.wantsPhotosOnline}
                onChange={e => setForm(f => ({...f, wantsPhotosOnline: e.target.checked}))}
            >
                Ich bin damit einverstanden, dass Fotos von mir online veröffentlicht werden dürfen.
            </Checkbox>

            {mutation.isError && (
                <p className="text-sm text-[--color-error]">Check-in fehlgeschlagen. Bitte versuche es erneut.</p>
            )}

            <Button type="submit" disabled={!canSubmit || mutation.isPending} fullWidth>
                {mutation.isPending ? "Wird eingecheckt…" : "Einchecken"}
            </Button>
        </form>
    )
}

export default CheckInForm
