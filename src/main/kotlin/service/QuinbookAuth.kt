package at.escapehouse.service

import at.escapehouse.config.QuinbookConfig
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonIgnoreUnknownKeys
import kotlin.time.Duration.Companion.seconds


class QuinbookAuth (
    val quinBookConfig: QuinbookConfig,
    val httpClient: HttpClient,
){
    private var token: String? = null
    private var expiresAt: Long = 0
    private val refreshLock = Mutex()

    private val refreshBuffer = 30.seconds

    suspend fun getBearerToken():String {
        if (isTokenValid()) return token!!

        return refreshLock.withLock {
            //Check again for when a request is waiting for the lock and the token has already been refetched
            if (isTokenValid()) return token!!

            val tokenResponse = fetchNewToken()
            this.token = tokenResponse.accessToken
            this.expiresAt = tokenResponse.expiresIn * 1000 + System.currentTimeMillis()
            tokenResponse.accessToken
        }

    }

    private fun isTokenValid() =
        !token.isNullOrBlank() && System.currentTimeMillis() < expiresAt - refreshBuffer.inWholeMilliseconds

    private suspend fun fetchNewToken(): TokenResponse =
        httpClient.post("${quinBookConfig.baseUrl}/v1/auth/token"){
            contentType(ContentType.Application.Json)
            setBody(
                TokenRequest(
                    clientId = quinBookConfig.clientId,
                    clientSecret = quinBookConfig.clientSecret
                )
            )
        }.body()

    @Serializable
    data class TokenRequest(
        @SerialName("grant_type")
        val grantType: String = "client_credentials",

        @SerialName("client_id")
        val clientId: String,

        @SerialName("client_secret")
        val clientSecret: String
    )
    @Serializable
    @JsonIgnoreUnknownKeys
    data class TokenResponse(
        @SerialName("access_token")
        val accessToken: String,

        @SerialName("session")
        val session: String,

        @SerialName("expires_in")
        val expiresIn: Long
    )
}