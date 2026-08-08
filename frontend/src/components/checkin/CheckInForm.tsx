import {useState} from "react"
import {useMutation} from "@tanstack/react-query"
import type {CheckInSlot} from "../../types/Slot.ts"
import {postCheckIn, type CheckInFormData} from "../../api/checkInApi.ts"
import SlotInfo from "./SlotInfo.tsx"
import {Button} from "../ui/Button.tsx"
import {FormField} from "../ui/FormField.tsx"
import {Checkbox} from "../ui/Checkbox.tsx"

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
