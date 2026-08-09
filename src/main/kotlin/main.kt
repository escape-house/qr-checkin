package at.escapehouse

import at.escapehouse.data.ErrorResponse
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.websocket.WebSockets

import kotlinx.serialization.json.Json

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.configureWebSockets() {
    install(WebSockets)
}

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