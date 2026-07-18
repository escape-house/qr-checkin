package at.escapehouse.service

import at.escapehouse.config.QuinbookConfig
import at.escapehouse.data.Slot
import at.escapehouse.dto.QuinbookSlotResponseDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.get
import io.ktor.http.HttpStatusCode
import java.time.LocalDate
import java.time.LocalDateTime


class QuinbookService(
    val httpClient: HttpClient,
    val quinbookConfig: QuinbookConfig,
    val quinBookAuth: QuinbookAuth
)
{
    suspend fun getSlotsOfToday(): List<Slot> {
        val date = LocalDate.now()
        val response = fetch("/v1/slots/calendar/$date")
        //val response = fetch("/v1/slots/calendar/2026-07-17")
        println(response.status.value)
        if (response.status != HttpStatusCode.OK) throw RuntimeException("Response ")
        return response.body<QuinbookSlotResponseDto>().toDomain()
    }

    suspend fun getBookingsOfToday() =
        getSlotsOfToday().filterNot(Slot::isAvailable)

    suspend fun getCheckInSlots() =
        getBookingsOfToday().filter { booking ->
            val now = LocalDateTime.now()
            //val now = LocalDateTime.parse("2026-07-17T16:00:00")
            val checkInStart = booking.start.minusMinutes(30)
            val checkInEnd = booking.start.plusMinutes(20)

            !now.isBefore(checkInStart) && !now.isAfter(checkInEnd)
        }



    private suspend fun fetch(path: String) =
        httpClient.get("${quinbookConfig.baseUrl}$path"){
            bearerAuth(quinBookAuth.getBearerToken())
        }

}