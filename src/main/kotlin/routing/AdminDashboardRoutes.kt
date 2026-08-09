package at.escapehouse.routes

import at.escapehouse.data.ErrorResponse
import at.escapehouse.dto.AdminCheckInSlot
import at.escapehouse.dto.AdminRegistrationUpdateRequest
import at.escapehouse.dto.CheckinSlotDto
import at.escapehouse.dto.CheckinSlotDto.Companion.fromSlot
import at.escapehouse.repository.CheckInRepository
import at.escapehouse.service.AdminRegistrationService
import at.escapehouse.service.DashboardBroadcaster
import at.escapehouse.service.QuinbookService
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import io.ktor.server.websocket.webSocket
import java.time.LocalDate
import java.time.format.DateTimeParseException
import kotlin.collections.map

fun Route.adminDashBoardRoutes(
    quinbookService: QuinbookService,
    checkInRepository: CheckInRepository,
    dashboardBroadcaster: DashboardBroadcaster,
) {
    route("/admin/dashboard") {
        get {
            val date = call.request.queryParameters["date"]
                ?.let { runCatching { LocalDate.parse(it) }.getOrNull() }
                ?: LocalDate.now()
            call.respond(quinbookService.getSlotsForDate(date).map({
                AdminCheckInSlot.fromSlot(it, checkInRepository)
            }))
        }

        webSocket("/ws") {
            dashboardBroadcaster.add(this)
            try {
                for (frame in incoming) { /* ignore client frames */ }
            } finally {
                dashboardBroadcaster.remove(this)
            }
        }
    }
}