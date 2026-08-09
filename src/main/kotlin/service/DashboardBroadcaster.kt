package at.escapehouse.service

import io.ktor.server.websocket.DefaultWebSocketServerSession
import io.ktor.websocket.Frame
import io.ktor.websocket.close
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap

class DashboardBroadcaster {
    private val sessions: MutableSet<DefaultWebSocketServerSession> =
        ConcurrentHashMap.newKeySet()
    private val scope = CoroutineScope(Dispatchers.IO)

    fun add(session: DefaultWebSocketServerSession) = sessions.add(session)
    fun remove(session: DefaultWebSocketServerSession) = sessions.remove(session)

    fun broadcast() {
        scope.launch {
            val dead = mutableListOf<DefaultWebSocketServerSession>()
            for (session in sessions) {
                try {
                    session.send(Frame.Text("refresh"))
                } catch (_: Exception) {
                    dead += session
                }
            }
            sessions.removeAll(dead.toSet())
        }
    }
}
