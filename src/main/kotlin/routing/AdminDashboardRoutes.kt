package at.escapehouse.routes

import at.escapehouse.data.ErrorResponse
import at.escapehouse.dto.AdminCheckInSlot
import at.escapehouse.dto.AdminRegistrationUpdateRequest
import at.escapehouse.dto.CheckinSlotDto
import at.escapehouse.dto.CheckinSlotDto.Companion.fromSlot
import at.escapehouse.repository.CheckInRepository
import at.escapehouse.service.AdminRegistrationService
import at.escapehouse.service.QuinbookService
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import java.time.LocalDate
import java.time.format.DateTimeParseException
import kotlin.collections.map

fun Route.adminDashBoardRoutes(
    quinbookService: QuinbookService,
    checkInRepository: CheckInRepository
) {
    route("/admin/dashboard") {
        get {
            call.respond(quinbookService.getBookingsOfToday().map({
                AdminCheckInSlot.fromSlot(it, checkInRepository)
            }))
        }
    }
}