package at.escapehouse.auth

import at.escapehouse.data.ErrorResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.session
import io.ktor.server.config.property
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.SessionTransportTransformerMessageAuthentication
import io.ktor.server.sessions.clear
import io.ktor.server.sessions.cookie
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import kotlinx.coroutines.delay
import kotlinx.serialization.Serializable
import java.security.MessageDigest
import java.time.Instant
import java.util.Base64

private const val SESSION_DURATION_SECONDS = 8 * 60 * 60L

@Serializable
data class AdminSession(
    val expiresAtEpochSeconds: Long,
)

@Serializable
data class AdminLoginRequest(
    val password: String,
)

@Serializable
data class AdminAuthenticationResponse(
    val authenticated: Boolean,
)

@Serializable
data class AdminPingResponse(
    val message: String,
)

fun Application.configureAdminAuth() {
    val adminPassword =
        environment.config.property("admin.password").getString()

    val sessionSignKey = Base64.getDecoder().decode(
        environment.config
            .property("admin.sessionSignKey")
            .getString()
    )

    val secureCookie =
        environment.config
            .property("admin.secureCookie")
            .getString()
            .toBoolean()

    install(Sessions) {
        cookie<AdminSession>("admin_session") {
            cookie.path = "/"
            cookie.httpOnly = true
            cookie.secure = secureCookie
            cookie.maxAgeInSeconds = SESSION_DURATION_SECONDS
            cookie.extensions["SameSite"] = "Strict"

            sendOnlyIfModified = true

            transform(
                SessionTransportTransformerMessageAuthentication(
                    sessionSignKey
                )
            )
        }
    }

    install(Authentication) {
        session<AdminSession>("admin-session") {
            validate { session ->
                session.takeIf {
                    it.expiresAtEpochSeconds >
                            Instant.now().epochSecond
                }
            }

            challenge {
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse(
                        error = "Admin login required"
                    )
                )
            }
        }
    }

    routing {
        route("/api/auth") {
            post("/login") {
                val login = call.receive<AdminLoginRequest>()

                if (
                    !constantTimeEquals(
                        login.password,
                        adminPassword,
                    )
                ) {
                    // Makes rapid brute-force attempts slightly slower.
                    delay(350)

                    call.respond(
                        HttpStatusCode.Unauthorized,
                        ErrorResponse(
                            error = "Invalid password"
                        )
                    )

                    return@post
                }

                call.sessions.set(
                    AdminSession(
                        expiresAtEpochSeconds =
                            Instant.now().epochSecond +
                                    SESSION_DURATION_SECONDS
                    )
                )

                call.respond(
                    AdminAuthenticationResponse(
                        authenticated = true
                    )
                )
            }

            post("/logout") {
                call.sessions.clear<AdminSession>()

                call.respond(
                    AdminAuthenticationResponse(
                        authenticated = false
                    )
                )
            }

            get("/session") {
                val session =
                    call.sessions.get<AdminSession>()

                val authenticated =
                    session != null &&
                            session.expiresAtEpochSeconds >
                            Instant.now().epochSecond

                if (!authenticated) {
                    call.sessions.clear<AdminSession>()
                }

                call.respond(
                    AdminAuthenticationResponse(
                        authenticated = authenticated
                    )
                )
            }
        }

    }
}

private fun constantTimeEquals(
    suppliedPassword: String,
    expectedPassword: String,
): Boolean {
    return MessageDigest.isEqual(
        suppliedPassword.encodeToByteArray(),
        expectedPassword.encodeToByteArray(),
    )
}