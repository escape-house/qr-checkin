import {useEffect, useState} from "react"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {useSearchParams} from "react-router-dom"
import {fetchDashboard} from "../../api/dashboardApi.ts"
import {TimetableGrid} from "../../components/admin/TimetableGrid.tsx"
import KeyScreen from "../../components/KeyScreen.tsx"

function useLiveClock() {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])
    return now
}

function useDashboardWebSocket() {
    const queryClient = useQueryClient()
    useEffect(() => {
        let ws: WebSocket
        let retryTimeout: ReturnType<typeof setTimeout>

        function connect() {
            const proto = location.protocol === "https:" ? "wss:" : "ws:"
            ws = new WebSocket(`${proto}//${location.host}/api/admin/dashboard/ws`)

            ws.onmessage = (e) => {
                if (e.data === "refresh") {
                    queryClient.invalidateQueries({queryKey: ["dashboard"]})
                }
            }

            ws.onclose = () => {
                retryTimeout = setTimeout(connect, 3_000)
            }
        }

        connect()
        return () => {
            clearTimeout(retryTimeout)
            ws?.close()
        }
    }, [queryClient])
}

function AdminTimetablePage() {
    const now = useLiveClock()
    useDashboardWebSocket()
    const [params] = useSearchParams()
    const date = params.get("date") ?? undefined

    const {data, isPending, isError} = useQuery({
        queryKey: ["dashboard", date],
        queryFn: () => fetchDashboard(date),
        refetchInterval: 30_000,
    })

    if (isPending) return <KeyScreen />
    if (isError) return <p className="text-error">Fehler beim Laden des Tagesplans.</p>
    if (!data || data.length === 0) return <p className="text-muted">Keine Buchungen für heute.</p>

    return <TimetableGrid slots={data} now={now} />
}

export default AdminTimetablePage
