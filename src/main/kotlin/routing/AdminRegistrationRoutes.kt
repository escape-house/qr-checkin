package at.escapehouse.routes

import at.escapehouse.data.ErrorResponse
import at.escapehouse.dto.AdminRegistrationUpdateRequest
import at.escapehouse.service.AdminRegistrationService
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

fun Route.adminRegistrationRoutes(
    service: AdminRegistrationService,
) {
    route("/admin/registrations") {

        get {
            val page = call.request
                .queryParameters["page"]
                ?.toIntOrNull()
                ?: 0

            val pageSize = call.request
                .queryParameters["pageSize"]
                ?.toIntOrNull()
                ?: 20

            val name = call.request
                .queryParameters["name"]
                ?.trim()
                ?.takeIf(String::isNotEmpty)

            val dateParameter = call.request
                .queryParameters["date"]
                ?.trim()
                ?.takeIf(String::isNotEmpty)

            val date = dateParameter?.let {
                try {
                    LocalDate.parse(it)
                } catch (_: DateTimeParseException) {
                    throw IllegalArgumentException(
                        "Invalid date. Expected YYYY-MM-DD"
                    )
                }
            }

            val response = service.getRegistrations(
                page = page,
                pageSize = pageSize,
                name = name,
                date = date,
            )

            call.respond(
                status = HttpStatusCode.OK,
                message = response,
            )
        }

        put("/{id}") {
            val id = call.parameters["id"]
                ?: throw IllegalArgumentException(
                    "Missing registration id"
                )

            val request =
                call.receive<AdminRegistrationUpdateRequest>()

            val updated =
                service.updateRegistration(
                    id = id,
                    request = request,
                )

            if (updated == null) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ErrorResponse(
                        error =
                            "Registration $id was not found"
                    ),
                )

                return@put
            }

            call.respond(
                status = HttpStatusCode.OK,
                message = updated,
            )
        }

        delete("/{id}") {
            val id = call.parameters["id"]
                ?: throw IllegalArgumentException(
                    "Missing registration id"
                )

            val deleted =
                service.deleteRegistration(id)

            if (!deleted) {
                call.respond(
                    status = HttpStatusCode.NotFound,
                    message = ErrorResponse(
                        error =
                            "Registration $id was not found"
                    ),
                )

                return@delete
            }

            call.respond(
                HttpStatusCode.NoContent
            )
        }
    }
}