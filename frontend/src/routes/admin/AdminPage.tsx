import {useMutation, useQueryClient} from "@tanstack/react-query"
import {useNavigate} from "react-router-dom"
import {logout} from "../../api/adminApi.ts"
import {Button} from "../../components/ui/Button.tsx"

function AdminPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["admin-session"]})
            navigate("/admin/login", {replace: true})
        },
    })

    return (
        <div className="max-w-lg mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Admin</h1>
                <Button
                    variant="secondary"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                >
                    Abmelden
                </Button>
            </div>

            <p className="text-text-secondary">Admin-Bereich. Weitere Funktionen folgen.</p>
        </div>
    )
}

export default AdminPage
