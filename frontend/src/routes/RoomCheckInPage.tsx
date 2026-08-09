import {useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useMutation} from "@tanstack/react-query"
import {postCheckIn, type CheckInFormData} from "../api/checkInApi.ts"
import {SlotUtils} from "../util/SlotUtil.ts"
import {Button} from "../components/ui/Button.tsx"
import {FormField} from "../components/ui/FormField.tsx"
import {Checkbox} from "../components/ui/Checkbox.tsx"

const emptyForm: CheckInFormData = {
    firstName: "",
    lastName: "",
    email: "",
    agreesToTermsAndCondition: false,
    wantsPhotosOnline: false,
}

function RoomCheckInPage() {
    const {roomName} = useParams<{roomName: string}>()
    const navigate = useNavigate()
    const room = decodeURIComponent(roomName?.replace("_", " ") ?? "")

    const [form, setForm] = useState<CheckInFormData>(emptyForm)
    const [checkedIn, setCheckedIn] = useState(false)

    const mutation = useMutation({
        mutationFn: () => postCheckIn(room, null, form),
        onSuccess: () => setCheckedIn(true),
    })

    const emailValid = form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    const canSubmit = form.firstName.trim() !== "" && form.lastName.trim() !== "" && form.agreesToTermsAndCondition && emailValid

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (canSubmit) mutation.mutate()
    }

    if (checkedIn) {
        return (
            <div className="max-w-lg mx-auto px-4 py-6 text-center">
                <img
                    src={SlotUtils.getRoomImageUrl(room)}
                    alt={room}
                    className="w-full rounded-[--radius-lg] mb-4 object-cover max-h-48"
                />
                <div className="font-semibold text-xl mb-1">{room}</div>
                <p className="text-xl font-semibold text-success mt-4">Erfolgreich eingecheckt!</p>
                <Button onClick={() => setCheckedIn(false)} className="mt-4">
                    Weitere Person einchecken
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate("/rooms")}
                    aria-label="Zurück"
                    className="text-text-secondary hover:text-text transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                </button>
                <h1 className="text-2xl font-bold">Zurück</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="mb-2">
                    <img
                        src={SlotUtils.getRoomImageUrl(room)}
                        alt={room}
                        className="w-full rounded-[--radius-lg] mb-3 object-cover max-h-48"
                    />
                    <div className="font-semibold text-xl">{room}</div>
                </div>

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
                    <a href="/agb" target="_blank" rel="noreferrer" className="text-primary underline">
                        Allgemeinen Geschäftsbedingungen
                    </a>{" "}
                    zu. <span className="text-error">*</span>
                </Checkbox>

                <Checkbox
                    checked={form.wantsPhotosOnline}
                    onChange={e => setForm(f => ({...f, wantsPhotosOnline: e.target.checked}))}
                >
                    Ich bin damit einverstanden, dass Fotos von mir online veröffentlicht werden dürfen.
                </Checkbox>

                {mutation.isError && (
                    <p className="text-sm text-error">Check-in fehlgeschlagen. Bitte versuche es erneut.</p>
                )}

                <Button type="submit" disabled={!canSubmit || mutation.isPending} fullWidth>
                    {mutation.isPending ? "Wird eingecheckt…" : "Einchecken"}
                </Button>
            </form>
        </div>
    )
}

export default RoomCheckInPage
