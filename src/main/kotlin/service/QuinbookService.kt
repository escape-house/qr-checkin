package at.escapehouse.service

import at.escapehouse.config.QuinbookConfig
import at.escapehouse.data.Slot
import at.escapehouse.dto.QuinbookSlotResponseDto
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.time.LocalDate
import java.time.LocalDateTime
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes


class QuinbookService(
    val httpClient: HttpClient,
    val quinbookConfig: QuinbookConfig,
    val quinBookAuth: QuinbookAuth,
    val backgroundScope: CoroutineScope
) {

    private val cacheTimeout: Duration = 5.minutes
    private val hardCacheTimeout: Duration = 30.minutes
    private val cacheMutex = Mutex()

    @Volatile
    private var cachedSlots: List<Slot>? = null

    @Volatile
    private var lastCacheUpdate: Long = 0L

    suspend fun getSlotsOfToday(): List<Slot> {
        val currentCache = cachedSlots
        if (currentCache == null) {
            return refreshCacheIfRequired()
        }
        if (isCacheExpired(hardCacheTimeout)) {
            return refreshCacheIfRequired()
        }
        if (isCacheExpired(cacheTimeout)) {
            refreshCacheInBackground()
        }

        return currentCache
        return refreshCacheIfRequired()
    }

    private fun isCacheExpired(timeout: Duration) = System.currentTimeMillis() - lastCacheUpdate >= timeout.inWholeMilliseconds

    private fun refreshCacheInBackground() {
        backgroundScope.launch {
            try {
                refreshCacheIfRequired() //Launch in Thread
            } catch (exception: Exception) {
                println("Could not refresh slots cache: ${exception.message}")
            }
        }
    }

    private suspend fun refreshCacheIfRequired(): List<Slot> {
        return cacheMutex.withLock {
            val currentCache = cachedSlots
            if (currentCache != null && !isCacheExpired(cacheTimeout)) { //Recheck for the ones waiting in the lock
                return@withLock currentCache
            }
            val freshSlots = fetchSlotsFromBackend(LocalDate.now())
            cachedSlots = freshSlots
            lastCacheUpdate = System.currentTimeMillis()
            freshSlots
        }
    }

    private suspend fun fetchSlotsFromBackend(date: LocalDate): List<Slot> {

        val response = fetch("/v1/slots/calendar/2026-07-25")
        //val response = fetch("/v1/slots/calendar/$date")

        if (response.status != HttpStatusCode.OK) {
            throw RuntimeException(
                "Could not fetch slots: HTTP ${response.status.value}"
            )
        }

        return response
            .body<QuinbookSlotResponseDto>()
            .toDomain()
    }

    suspend fun getBookingsOfToday() =
        getSlotsOfToday().filter{
            !it.isAvailable && it.type!="mask"
        }

    suspend fun getCheckInSlots() =
        getSlotsOfToday().filter { booking ->
            //val now = LocalDateTime.now()
            val now = LocalDateTime.parse("2026-07-25T16:00:00")
            //val checkInStart = booking.start.minusMinutes(30)
            //val checkInEnd = booking.start.plusMinutes(20)
            val checkInStart = booking.start.minusMinutes(60)
            val checkInEnd = booking.start.plusMinutes(60)

            !now.isBefore(checkInStart) && !now.isAfter(checkInEnd)
        }

    suspend fun getSlot(date: LocalDate, slotId: Long) =
        fetchSlotsFromBackend(date).find {
            it.id == slotId
        }


    private suspend fun fetch(path: String) =
        httpClient.get("${quinbookConfig.baseUrl}$path") {
            bearerAuth(quinBookAuth.getBearerToken())
        }

}
