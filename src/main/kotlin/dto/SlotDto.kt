package at.escapehouse.dto

import at.escapehouse.data.Customer
import at.escapehouse.data.LocalDateSerializer
import at.escapehouse.data.Room
import at.escapehouse.data.Slot
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class QuinbookSlotResponseDto(
    val events: List<RoomDto>,
    val slots: List<SlotDto>
){
    fun toDomain(): List<Slot> {
        val roomsById = events.associateBy { it.id }

        return slots.map { slot ->
            val roomDto = roomsById[slot.iEvent]

            Slot(
                id = slot.id,
                isAvailable = slot.isAvailable,
                start = slot.start,
                end = slot.end,
                players = slot.players,
                type = slot.type,
                customer = slot.customer,
                room = Room(
                    id = roomDto?.id,
                    name = roomDto?.name
                )
            )
        }
    }
}

@Serializable
data class RoomDto(
    val id: Long,
    val name: String
)

@Serializable
data class SlotDto(
    @SerialName("iEventSlot")
    val id: Long?,
    val isAvailable: Boolean,

    @Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,

    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,

    @SerialName("bookCount")
    val players: Int?,

    val type: String?,
    val customer: Customer?,

    val iEvent: Long
){
}