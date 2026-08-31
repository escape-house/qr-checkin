package at.escapehouse.routing

import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class AppConfig(
    val roomOrder: List<String>,
)

fun Route.configRoutes() {
    get("/config") {
        val roomOrder = System.getenv("ROOM_ORDER")
            ?.split(",")
            ?.map { it.trim() }
            ?.filter { it.isNotEmpty() }
            ?: emptyList()

        call.respond(AppConfig(roomOrder = roomOrder))
    }
}
