import {useEffect, useState} from "react"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import type {Registration, RegistrationUpdate} from "../../api/registrationsApi.ts"
import {updateRegistration} from "../../api/registrationsApi.ts"
import {Button} from "../ui/Button.tsx"
import {FormField} from "../ui/FormField.tsx"
import {Checkbox} from "../ui/Checkbox.tsx"

type Props = {
    registration: Registration
    onClose: () => void
}

export function EditRegistrationDialog({registration, onClose}: Props) {
    const queryClient = useQueryClient()
    const [form, setForm] = useState<RegistrationUpdate>({
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        roomName: registration.roomName,
        slotId: registration.slotId,
        agreesToTermsAndCondition: registration.agreesToTermsAndCondition,
        wantsPhotosOnline: registration.wantsPhotosOnline,
        wantsNewsletter: registration.wantsNewsletter,
    })

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    const mutation = useMutation({
        mutationFn: () => updateRegistration(registration.id, form),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["registrations"]})
            onClose()
        },
    })

    const emailRaw = form.email?.trim() ?? ""
    const emailValid = emailRaw === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)
    const canSave =
        form.firstName.trim() !== "" &&
        form.lastName.trim() !== "" &&
        emailValid &&
        form.roomName.trim() !== "" &&
        form.slotId > 0

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md mx-4 flex flex-col gap-4 shadow-xl">
                <h2 className="text-lg font-semibold">Registrierung bearbeiten</h2>

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
                    value={form.email ?? ""}
                    onChange={e => setForm(f => ({...f, email: e.target.value || null}))}
                    error={!emailValid ? "Ungültige E-Mail-Adresse." : undefined}
                />

                <div className="flex gap-3">
                    <FormField
                        label="Raum"
                        required
                        value={form.roomName}
                        onChange={e => setForm(f => ({...f, roomName: e.target.value}))}
                        wrapperClassName="flex-1"
                    />
                    <FormField
                        label="Slot-ID"
                        type="number"
                        required
                        value={String(form.slotId)}
                        onChange={e => setForm(f => ({...f, slotId: Number(e.target.value)}))}
                        wrapperClassName="w-32"
                    />
                </div>

                <Checkbox
                    checked={form.agreesToTermsAndCondition}
                    onChange={e => setForm(f => ({...f, agreesToTermsAndCondition: e.target.checked}))}
                >
                    AGB akzeptiert
                </Checkbox>

                <Checkbox
                    checked={form.wantsPhotosOnline}
                    onChange={e => setForm(f => ({...f, wantsPhotosOnline: e.target.checked}))}
                >
                    Fotos online erlaubt
                </Checkbox>

                <Checkbox
                    checked={form.wantsNewsletter}
                    onChange={e => setForm(f => ({...f, wantsNewsletter: e.target.checked}))}
                >
                    Newsletter
                </Checkbox>

                {mutation.isError && (
                    <p className="text-sm text-error">Fehler beim Speichern.</p>
                )}

                <div className="flex justify-end gap-2 mt-2">
                    <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
                        Abbrechen
                    </Button>
                    <Button onClick={() => mutation.mutate()} disabled={!canSave || mutation.isPending}>
                        {mutation.isPending ? "Speichern…" : "Speichern"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
