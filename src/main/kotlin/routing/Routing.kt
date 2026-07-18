package at.escapehouse.routing

import at.escapehouse.routes.quinbookRoutes
import at.escapehouse.service.CheckInService
import at.escapehouse.service.QuinbookAuth
import at.escapehouse.service.QuinbookService
import io.ktor.server.application.Application
import io.ktor.server.routing.route
import io.ktor.server.routing.routing

fun Application.configureRouting(
    quinbookService: QuinbookService,
    quinbookAuth: QuinbookAuth,
    checkInService: CheckInService
) {
    routing {
        route("/api"){
            quinbookRoutes(quinbookService, quinbookAuth)
            checkInRoutes(checkInService)
        }
        fronted()
    }
}