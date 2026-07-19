package at.escapehouse

import at.escapehouse.auth.AdminSession
import at.escapehouse.data.ErrorResponse
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.session
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import kotlinx.serialization.json.Json
import java.time.Instant

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(
            Json {
                ignoreUnknownKeys = true
                prettyPrint = true
                isLenient = true
                explicitNulls = false
            }
        )
    }
}

fun Application.configureErrorHandling() {

    val log = environment.log

    install(StatusPages) {
        exception<IllegalArgumentException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ErrorResponse(
                    error = cause.message ?: "Invalid request"
                )
            )
        }

        exception<Throwable> { call, cause ->
            log.error("Unhandled server error", cause)

            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse(
                    error = "Internal server error"
                )
            )
        }
    }
}

fun Application.configureCors() {
    install(CORS) {
        allowHost("localhost:5173", schemes = listOf("http"))

        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Options)

        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)

        allowCredentials = true
    }
}