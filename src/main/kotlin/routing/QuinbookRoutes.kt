package at.escapehouse.routes

import at.escapehouse.data.ErrorResponse
import at.escapehouse.dto.CheckinSlotDto
import at.escapehouse.dto.PrivacyCheckinSlotDto
import at.escapehouse.service.QuinbookAuth
import at.escapehouse.service.QuinbookService
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeParseException

fun Route.quinbookRoutes(
    quinbookService: QuinbookService,
    quinbookAuth: QuinbookAuth
) {
    route("/quinbook") {
        get("/checkInSlots") {
            call.respond(quinbookService.getCheckInSlots().map(CheckinSlotDto::fromSlot))
        }
        get("/slotsOfToday") {
            call.respond(quinbookService.getSlotsOfToday().map(CheckinSlotDto::fromSlot))
        }

        get("/slot/{date}/{slotId}") {
            val dateParameter = call.parameters["date"]
                ?: throw IllegalArgumentException("Missing date")

            val date = try {
                LocalDate.parse(dateParameter)
            } catch (_: DateTimeParseException) {
                throw IllegalArgumentException("Invalid date. Expected format: YYYY-MM-DD")
            }
            if (date.isBefore(LocalDate.now())) {
                throw IllegalArgumentException("Cant get Slots in the Past")
            }
            val slotId = call.parameters["slotId"]?.toLongOrNull() ?: throw IllegalArgumentException("Invalid slotId")
            val slot = quinbookService.getSlot(date, slotId)
            if (slot == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ErrorResponse(
                        error = "Slot $slotId was not found for $date"
                    ),
                )
                return@get
            }
            call.respond(status = HttpStatusCode.OK, message = PrivacyCheckinSlotDto.fromSlot(slot))
        }
        get("/token") {
            call.respond(quinbookAuth.getBearerToken())
        }
    }
}