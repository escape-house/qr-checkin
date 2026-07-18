package at.escapehouse.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Booking(
    @Serializable(with = LocalDateSerializer::class)
    @SerialName("createdAt")
    val createdAt: LocalDateTime?,
    @Serializable(with = LocalDateSerializer::class)
    @SerialName("serviceAt")
    val timeOfGame: LocalDateTime?,
    val customer: Customer,
    @SerialName("orderItems")
    val gameDetail: List<GameDetail>
)

@Serializable
data class GameDetail(
    @SerialName("eventName")
    val name: String?,
    @SerialName("quantity")
    val players: Int?
){

}

@Serializable
data class BookingResponse(
    val items: List<Booking>
)