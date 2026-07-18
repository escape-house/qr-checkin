package at.escapehouse.routing

import at.escapehouse.data.CheckInForm
import at.escapehouse.service.CheckInService
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route

fun Route.checkInRoutes(
    checkInService: CheckInService
) {
    route("/checkin") {
        post("/{roomName}") {
            val roomName = call.parameters["roomName"]
                ?: throw IllegalArgumentException(
                    "Missing roomName"
                )

            val form = call.receive<CheckInForm>()

            val response = checkInService.checkIn(
                checkInForm = form,
                roomName = roomName
            )

            call.respond(
                status = HttpStatusCode.Created,
                message = response
            )
        }

        post("/{roomName}/{slotId}") {
            val roomName = call.parameters["roomName"]
                ?: throw IllegalArgumentException(
                    "Missing roomName"
                )

            val slotIdParameter =
                call.parameters["slotId"]
                    ?: throw IllegalArgumentException(
                        "Missing slotId"
                    )

            val slotId = slotIdParameter.toLongOrNull()
                ?: throw IllegalArgumentException(
                    "Invalid slotId"
                )

            val form = call.receive<CheckInForm>()

            val response = checkInService.checkIn(
                checkInForm = form,
                roomName = roomName,
                slotId = slotId
            )

            call.respond(
                status = HttpStatusCode.Created,
                message = response
            )
        }
    }
}