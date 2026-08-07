package at.escapehouse.dto

import at.escapehouse.data.DeclarationOfConsent
import at.escapehouse.data.LocalDateSerializer
import at.escapehouse.data.Slot
import at.escapehouse.repository.CheckInRepository
import at.escapehouse.service.AdminRegistrationService
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
    val room: String?,
) {
    companion object {
        fun fromSlot(slot: Slot): CheckinSlotDto {
            val name =
                if (slot.customer == null) ""
                else if (slot.customer.firstName?.isNotBlank() == true && slot.customer.lastName?.isNotBlank() == true) "${slot.customer?.firstName?.trim()} ${slot.customer?.lastName?.trim()[0]}."
                else if (slot.customer.firstName.isNullOrBlank() && slot.customer.lastName.isNullOrBlank()) ""
                else if (slot.customer.firstName.isNullOrBlank() && slot.customer.lastName?.isNotBlank() == true) slot.customer.lastName.trim()
                else if (slot.customer.lastName.isNullOrBlank() && slot.customer.firstName?.isNotBlank() == true) slot.customer.firstName.trim()
                else ""

            return CheckinSlotDto(
                slot.id,
                slot.start,
                slot.end,
                slot.players,
                name,
                slot.customer?.companyName?.trim(),
                slot.room.name,
            )
        }
    }
}

@Serializable
data class PrivacyCheckinSlotDto(
    val id: Long?,
    @kotlinx.serialization.Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,
    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,
    val room: String?,
) {
    companion object {
        fun fromSlot(slot: Slot) = PrivacyCheckinSlotDto(
            slot.id,
            slot.start,
            slot.end,
            slot.room.name,
        )
    }
}

@Serializable
data class AdminCheckInSlot(
    val id: Long?,
    @kotlinx.serialization.Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,
    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,
    val players: Int?,
    val name: String?,
    val companyName: String?,
    val room: String?,
    val checkedInPlayers: List<DeclarationOfConsent>,
    val type: String
) {
    companion object {
        suspend fun fromSlot(slot: Slot, checkInRepository: CheckInRepository): AdminCheckInSlot {
            return AdminCheckInSlot(
                slot.id,
                slot.start,
                slot.end,
                slot.players,
                name = slot.customer?.firstName?.trim() + " " + slot.customer?.lastName?.trim(),
                slot.customer?.companyName?.trim(),
                slot.room.name,
                checkInRepository.findBySlotId(slot.id?:-1),
                slot.type?:""
            )
        }
    }
}
