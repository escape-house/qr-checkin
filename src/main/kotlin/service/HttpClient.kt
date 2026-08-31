package at.escapehouse.service

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationStopping
import kotlinx.serialization.json.Json

fun provideHttpClient(
    application: Application
): HttpClient {
    val client = HttpClient(CIO) {
        install(Logging) {
            level = LogLevel.NONE
        }
        install(ContentNegotiation){
                json(Json {
                    ignoreUnknownKeys = true
                    prettyPrint = true
                    isLenient = true
                })
            }
    }

    application.monitor.subscribe(ApplicationStopping){
        client.close()
    }

    return client
}