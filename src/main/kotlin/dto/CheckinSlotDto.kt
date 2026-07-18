package at.escapehouse.dto

import at.escapehouse.data.LocalDateSerializer
import at.escapehouse.data.Slot
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class CheckinSlotDto(
    val id: Long?,
    @kotlinx.serialization.Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,
    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,
    val players: Int?,
    val name: String?,
    val companyName: String?,
    val room: String?
) {
    companion object {
        fun fromSlot(slot: Slot) =
            CheckinSlotDto(
slot.id,
                slot.start,
                slot.end,
                slot.players,
                "${slot.customer?.firstName?.trim()} ${slot.customer?.lastName?.trim()[0]}.", //"John D."
                slot.customer?.companyName,
                slot.room.name
            )
    }
}
