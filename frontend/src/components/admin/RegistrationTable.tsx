import type {UseMutationResult} from "@tanstack/react-query"
import type {Registration} from "../../api/registrationsApi.ts"
import {Button} from "../ui/Button.tsx"

type Props = {
    items: Registration[]
    confirmDeleteId: string | null
    deleteMutation: UseMutationResult<void, Error, string>
    onFilterBySlot: (slotId: number) => void
    onEdit: (reg: Registration) => void
    onRequestDelete: (id: string) => void
    onCancelDelete: () => void
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
}

function BoolCell({value}: {value: boolean}) {
    return (
        <td className="px-3 py-2 text-center">
            <span className={value ? "text-green-600" : "text-muted"}>{value ? "✓" : "✗"}</span>
        </td>
    )
}

function RowActions({reg, confirmDeleteId, deleteMutation, onFilterBySlot, onEdit, onRequestDelete, onCancelDelete}: {
    reg: Registration
    confirmDeleteId: string | null
    deleteMutation: Props["deleteMutation"]
    onFilterBySlot: Props["onFilterBySlot"]
    onEdit: Props["onEdit"]
    onRequestDelete: Props["onRequestDelete"]
    onCancelDelete: Props["onCancelDelete"]
}) {
    return (
        <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => onFilterBySlot(reg.slotId)}>
                Nach Slot filtern
            </Button>
            <Button variant="secondary" onClick={() => onEdit(reg)}>
                Bearbeiten
            </Button>
            {confirmDeleteId === reg.id ? (
                <div className="flex gap-1">
                    <Button
                        variant="primary"
                        onClick={() => deleteMutation.mutate(reg.id)}
                        disabled={deleteMutation.isPending}
                        className="!bg-error !hover:bg-red-700"
                    >
                        Ja
                    </Button>
                    <Button variant="secondary" onClick={onCancelDelete}>
                        Nein
                    </Button>
                </div>
            ) : (
                <Button
                    variant="secondary"
                    onClick={() => onRequestDelete(reg.id)}
                    className="text-error border-error/40 hover:border-error"
                >
                    Löschen
                </Button>
            )}
        </div>
    )
}

export function RegistrationTable({
    items,
    confirmDeleteId,
    deleteMutation,
    onFilterBySlot,
    onEdit,
    onRequestDelete,
    onCancelDelete,
}: Props) {
    return (
        <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-surface border-b border-border text-left text-text-secondary">
                        <th className="px-3 py-2 font-medium">Vorname</th>
                        <th className="px-3 py-2 font-medium">Nachname</th>
                        <th className="px-3 py-2 font-medium">E-Mail</th>
                        <th className="px-3 py-2 font-medium">Raum</th>
                        <th className="px-3 py-2 font-medium">Slot-ID</th>
                        <th className="px-3 py-2 font-medium">Datum</th>
                        <th className="px-3 py-2 font-medium text-center">AGB</th>
                        <th className="px-3 py-2 font-medium text-center">Fotos</th>
                        <th className="px-3 py-2 font-medium"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={9} className="px-3 py-6 text-center text-muted">
                                Keine Einträge gefunden.
                            </td>
                        </tr>
                    )}
                    {items.map(reg => (
                        <tr
                            key={reg.id}
                            className="border-b border-border last:border-0 hover:bg-surface/60 transition-colors"
                        >
                            <td className="px-3 py-2">{reg.firstName}</td>
                            <td className="px-3 py-2">{reg.lastName}</td>
                            <td className="px-3 py-2 text-text-secondary"><a href={`mailto:${reg.email}`}>{reg.email}</a></td>
                            <td className="px-3 py-2">{reg.roomName}</td>
                            <td className="px-3 py-2">{reg.slotId}</td>
                            <td className="px-3 py-2 text-text-secondary whitespace-nowrap">
                                {new Date(reg.registrationDate).toLocaleString("de-AT", DATE_FORMAT)}
                            </td>
                            <BoolCell value={reg.agreesToTermsAndCondition} />
                            <BoolCell value={reg.wantsPhotosOnline} />
                            <td className="px-3 py-2">
                                <RowActions
                                    reg={reg}
                                    confirmDeleteId={confirmDeleteId}
                                    deleteMutation={deleteMutation}
                                    onFilterBySlot={onFilterBySlot}
                                    onEdit={onEdit}
                                    onRequestDelete={onRequestDelete}
                                    onCancelDelete={onCancelDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
