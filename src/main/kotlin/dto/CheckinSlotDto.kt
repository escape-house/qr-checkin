package at.escapehouse.dto

import at.escapehouse.data.DeclarationOfConsent
import at.escapehouse.data.LocalDateSerializer
import at.escapehouse.data.Slot
import at.escapehouse.repository.CheckInRepository
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class CheckinSlotDto(
    val id: Long?,
    @Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,
    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,
    val players: Int?,
    val name: String?,
    val room: String?,
    val language: String? = null,
) {
    companion object {
        fun fromSlot(slot: Slot): CheckinSlotDto {
            val first = slot.customer?.firstName?.trim()?.firstOrNull()
            val last  = slot.customer?.lastName?.trim()?.firstOrNull()
            val name = when {
                first != null && last != null -> "$first. $last."
                first != null -> "$first."
                last  != null -> "$last."
                else          -> ""
            }
            return CheckinSlotDto(
                slot.id,
                slot.start,
                slot.end,
                slot.players,
                name,
                slot.room.name,
                slot.language,
            )
        }
    }
}

@Serializable
data class PrivacyCheckinSlotDto(
    val id: Long?,
    @Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,
    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,
    val room: String?,
    val language: String? = null,
) {
    companion object {
        fun fromSlot(slot: Slot) = PrivacyCheckinSlotDto(
            slot.id,
            slot.start,
            slot.end,
            slot.room.name,
            slot.language,
        )
    }
}

@Serializable
data class AdminCheckInSlot(
    val id: Long?,
    @Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,
    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,
    val players: Int?,
    val name: String?,
    val companyName: String?,
    val room: String?,
    val checkedInPlayers: List<DeclarationOfConsent>,
    val type: String,
    val comment: String? = null,
    val language: String? = null,
) {
    companion object {
        suspend fun fromSlot(slot: Slot, checkInRepository: CheckInRepository): AdminCheckInSlot {
            return AdminCheckInSlot(
                slot.id,
                slot.start,
                slot.end,
                slot.players,
                name = if(slot.customer!=null) slot.customer.firstName?.trim() + " " + slot.customer.lastName?.trim() else "",
                slot.customer?.companyName?.trim(),
                slot.room.name,
                checkInRepository.findBySlotId(slot.id?:-1),
                slot.type?:"",
                slot.comment,
                slot.language,
            )
        }
    }
}
