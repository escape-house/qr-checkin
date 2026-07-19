package at.escapehouse.routes

import at.escapehouse.dto.CheckinSlotDto
import at.escapehouse.service.QuinbookAuth
import at.escapehouse.service.QuinbookService
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route

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

        get("/token") {
            call.respond(quinbookAuth.getBearerToken())
        }
    }
}