import {useState} from "react"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import type {Registration, RegistrationFilters} from "../../api/registrationsApi.ts"
import {fetchRegistrations, deleteRegistration} from "../../api/registrationsApi.ts"
import {RegistrationFilterBar} from "../../components/admin/RegistrationFilterBar.tsx"
import {RegistrationTable} from "../../components/admin/RegistrationTable.tsx"
import {Pagination} from "../../components/admin/Pagination.tsx"
import {EditRegistrationDialog} from "../../components/admin/EditRegistrationDialog.tsx"

const EMPTY_FILTERS: RegistrationFilters = {name: "", date: "", room: "", slotId: ""}
const PAGE_SIZE = 20

function AdminManageRegistrationsPage() {
    const queryClient = useQueryClient()

    const [draftFilters, setDraftFilters] = useState<RegistrationFilters>(EMPTY_FILTERS)
    const [activeFilters, setActiveFilters] = useState<RegistrationFilters>(EMPTY_FILTERS)
    const [page, setPage] = useState(0)

    const [editing, setEditing] = useState<Registration | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    const {data, isPending, isError} = useQuery({
        queryKey: ["registrations", page, activeFilters],
        queryFn: () => fetchRegistrations(page, PAGE_SIZE, activeFilters),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteRegistration(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["registrations"]})
            setConfirmDeleteId(null)
        },
    })

    function applyFilters() {
        setPage(0)
        setActiveFilters({...draftFilters})
    }

    function clearFilters() {
        setDraftFilters(EMPTY_FILTERS)
        setActiveFilters(EMPTY_FILTERS)
        setPage(0)
    }

    function filterBySlotId(slotId: number) {
        const f: RegistrationFilters = {...EMPTY_FILTERS, slotId: String(slotId)}
        setDraftFilters(f)
        setActiveFilters(f)
        setPage(0)
    }

    const hasFilters = Object.values(activeFilters).some(v => v !== "")

    return (
        <div className="flex flex-col gap-4">
            <RegistrationFilterBar
                draft={draftFilters}
                hasActive={hasFilters}
                onChange={setDraftFilters}
                onApply={applyFilters}
                onClear={clearFilters}
            />

            {isPending && <p className="text-muted">Lade…</p>}
            {isError && <p className="text-error">Fehler beim Laden der Registrierungen.</p>}

            {data && (
                <>
                    <p className="text-sm text-muted">
                        {data.totalItems} Einträge{hasFilters && " (gefiltert)"}
                    </p>
                    <RegistrationTable
                        items={data.items}
                        confirmDeleteId={confirmDeleteId}
                        deleteMutation={deleteMutation}
                        onFilterBySlot={filterBySlotId}
                        onEdit={setEditing}
                        onRequestDelete={setConfirmDeleteId}
                        onCancelDelete={() => setConfirmDeleteId(null)}
                    />
                    <Pagination
                        page={page}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            {editing && (
                <EditRegistrationDialog
                    registration={editing}
                    onClose={() => setEditing(null)}
                />
            )}
        </div>
    )
}

export default AdminManageRegistrationsPage
