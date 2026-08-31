package at.escapehouse.routing

import at.escapehouse.repository.CheckInRepository
import at.escapehouse.routes.adminDashBoardRoutes
import at.escapehouse.routes.adminRegistrationRoutes
import at.escapehouse.routes.quinbookRoutes
import at.escapehouse.service.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.routing.*

fun Application.configureRouting(
    quinbookService: QuinbookService,
    quinbookAuth: QuinbookAuth,
    checkInService: CheckInService,
    adminRegistrationService: AdminRegistrationService,
    checkInRepository: CheckInRepository,
    dashboardBroadcaster: DashboardBroadcaster,
) {
    routing {
        route("/api") {
            quinbookRoutes(quinbookService, quinbookAuth)
            checkInRoutes(checkInService)
            authenticate("admin-session") {
                adminRegistrationRoutes(adminRegistrationService)
                adminDashBoardRoutes(quinbookService, checkInRepository, dashboardBroadcaster)
            }
        }
        fronted()
    }
}