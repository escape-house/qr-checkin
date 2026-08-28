import {useState} from "react"
import {Navigate, useNavigate, useSearchParams} from "react-router-dom"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {fetchSession, login} from "../../api/adminApi.ts"
import {Button} from "../../components/ui/Button.tsx"
import {FormField} from "../../components/ui/FormField.tsx"

function AdminLoginPage() {
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient()

    const redirect = searchParams.get("redirect") ?? "/admin"

    const {data: session, isPending: sessionPending} = useQuery({
        queryKey: ["admin-session"],
        queryFn: fetchSession,
        retry: false,
    })

    const mutation = useMutation({
        mutationFn: () => login(password),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["admin-session"]})
            navigate(redirect, {replace: true})
        },
    })

    if (sessionPending) {
        return <div className="flex items-center justify-center min-h-screen text-muted">Lade…</div>
    }

    if (session?.authenticated) {
        return <Navigate to={redirect} replace />
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password.trim()) mutation.mutate()
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-sans font-bold mb-8 text-center">Admin Login</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FormField
                        label="Passwort"
                        type="password"
                        required
                        autoFocus
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    {mutation.isError && (
                        <p className="text-sm text-error">
                            {mutation.error instanceof Error ? mutation.error.message : "Login fehlgeschlagen."}
                        </p>
                    )}

                    <Button type="submit" disabled={!password.trim() || mutation.isPending} fullWidth>
                        {mutation.isPending ? "Anmelden…" : "Anmelden"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default AdminLoginPage
