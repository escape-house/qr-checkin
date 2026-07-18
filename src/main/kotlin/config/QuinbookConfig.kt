package at.escapehouse.config

import io.ktor.server.application.Application
import io.ktor.server.plugins.di.annotations.Property

class QuinbookConfig (
    val clientId: String,
    val clientSecret: String,
    val baseUrl: String
)

fun provideQuinbookConfig(
    application: Application
): QuinbookConfig =
    QuinbookConfig(
        clientId = application.environment.config.property("quinbook.clientId").getString(),
        clientSecret = application.environment.config.property("quinbook.clientSecret").getString(),
        baseUrl = application.environment.config.property("quinbook.baseUrl").getString()
    )