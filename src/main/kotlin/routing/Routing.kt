package at.escapehouse.routing

import at.escapehouse.auth.AdminPingResponse
import at.escapehouse.repository.CheckInRepository
import at.escapehouse.routes.adminDashBoardRoutes
import at.escapehouse.routes.adminRegistrationRoutes
import at.escapehouse.routes.quinbookRoutes
import at.escapehouse.service.AdminRegistrationService
import at.escapehouse.service.CheckInService
import at.escapehouse.service.QuinbookAuth
import at.escapehouse.service.QuinbookService
import io.ktor.server.application.Application
import io.ktor.server.auth.authenticate
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.ktor.server.routing.routing

fun Application.configureRouting(
    quinbookService: QuinbookService,
    quinbookAuth: QuinbookAuth,
    checkInService: CheckInService,
    adminRegistrationService: AdminRegistrationService,
    checkInRepository: CheckInRepository
) {
    routing {
        route("/api"){
            quinbookRoutes(quinbookService, quinbookAuth)
            checkInRoutes(checkInService)
            authenticate("admin-session") {
                adminRegistrationRoutes(adminRegistrationService)
                adminDashBoardRoutes(quinbookService, checkInRepository)
            }
        }
        fronted()
    }
}