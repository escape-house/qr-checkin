import {useState} from "react"
import {useMutation} from "@tanstack/react-query"
import type {CheckInSlot} from "../../types/Slot.ts"
import {postCheckIn, type CheckInFormData} from "../../api/checkInApi.ts"
import SlotInfo from "./SlotInfo.tsx"
import {Button} from "../ui/Button.tsx"
import {FormField} from "../ui/FormField.tsx"
import {Checkbox} from "../ui/Checkbox.tsx"
import HouseRules from "./HouseRules.tsx"
import {useT} from "../../i18n/LanguageContext.tsx"

const emptyForm: CheckInFormData = {
    firstName: "",
    lastName: "",
    email: "",
    agreesToTermsAndCondition: false,
    wantsPhotosOnline: false,
    wantsNewsletter: false,
}

type Props = {
    slot: CheckInSlot
    onSuccess: () => void
}

function CheckInForm({slot, onSuccess}: Props) {
    const {t} = useT()
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
            <HouseRules/>
            <div className="flex gap-3">
                <FormField
                    label={t("formFirstName")}
                    required
                    value={form.firstName}
                    onChange={e => setForm(f => ({...f, firstName: e.target.value}))}
                    wrapperClassName="flex-1"
                />
                <FormField
                    label={t("formLastName")}
                    required
                    value={form.lastName}
                    onChange={e => setForm(f => ({...f, lastName: e.target.value}))}
                    wrapperClassName="flex-1"
                />
            </div>

            <FormField
                label={t("formEmail")}
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                error={!emailValid ? t("formEmailInvalid") : undefined}
            />

            <Checkbox
                required
                checked={form.agreesToTermsAndCondition}
                onChange={e => setForm(f => ({...f, agreesToTermsAndCondition: e.target.checked}))}
            >
                {t("formConsentPrefix")}{" "}
                <a href="https://escape-house.at/allgemeine-geschaftsbedingungen/" target="_blank" rel="noreferrer" className="text-primary underline">
                    {t("formConsentLinkText")}
                </a>{" "}
                {t("formConsentSuffix")} <span className="text-error">*</span>
            </Checkbox>

            <Checkbox
                checked={form.wantsPhotosOnline}
                onChange={e => setForm(f => ({...f, wantsPhotosOnline: e.target.checked}))}
            >
                {t("formPhotoConsent")}
            </Checkbox>

            <Checkbox
                checked={form.wantsNewsletter}
                onChange={e => setForm(f => ({...f, wantsNewsletter: e.target.checked}))}
            >
                {t("formNewsletter")}
            </Checkbox>

            <p className="text-xs text-text-secondary"><span className="text-error">*</span> {t("formRequiredField")}</p>

            {mutation.isError && (
                <p className="text-sm text-error">{t("formError")}</p>
            )}

            <Button type="submit" disabled={!canSubmit || mutation.isPending} fullWidth>
                {mutation.isPending ? t("formSubmitLoading") : t("formSubmit")}
            </Button>
        </form>
    )
}

export default CheckInForm
