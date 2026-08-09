import type {RegistrationFilters} from "../../api/registrationsApi.ts"
import {Button} from "../ui/Button.tsx"
import {Input} from "../ui/Input.tsx"

type Props = {
    draft: RegistrationFilters
    hasActive: boolean
    onChange: (f: RegistrationFilters) => void
    onApply: () => void
    onClear: () => void
}

export function RegistrationFilterBar({draft, hasActive, onChange, onApply, onClear}: Props) {
    function field(key: keyof RegistrationFilters) {
        return (e: React.ChangeEvent<HTMLInputElement>) => onChange({...draft, [key]: e.target.value})
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") onApply()
    }

    return (
        <div className="flex flex-wrap gap-2 items-end">
            <label className="flex flex-col gap-1 text-sm font-medium">
                Name
                <Input
                    placeholder="Max Mustermann"
                    value={draft.name}
                    onChange={field("name")}
                    onKeyDown={onKeyDown}
                    className="w-44"
                />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
                Datum
                <Input
                    type="date"
                    value={draft.date}
                    onChange={field("date")}
                    onKeyDown={onKeyDown}
                    className="w-40"
                />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
                Raum
                <Input
                    placeholder="Raum"
                    value={draft.room}
                    onChange={field("room")}
                    onKeyDown={onKeyDown}
                    className="w-36"
                />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
                Slot-ID
                <Input
                    type="number"
                    placeholder="ID"
                    value={draft.slotId}
                    onChange={field("slotId")}
                    onKeyDown={onKeyDown}
                    className="w-28"
                />
            </label>
            <Button onClick={onApply}>Suchen</Button>
            {hasActive && (
                <Button variant="secondary" onClick={onClear}>Zurücksetzen</Button>
            )}
        </div>
    )
}
