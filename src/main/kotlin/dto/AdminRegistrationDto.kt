package at.escapehouse.dto

import at.escapehouse.data.LocalDateSerializer
import kotlinx.serialization.Serializable
import java.time.LocalDate
import java.time.LocalDateTime

@Serializable
data class AdminRegistrationDto(
    val id: String,
    val firstName: String,
    val lastName: String,
    val email: String?,
    val roomName: String,
    val slotId: Long,
    @Serializable(with = LocalDateSerializer::class)
    val registrationDate: LocalDateTime,
    val agreesToTermsAndCondition: Boolean,
    val wantsPhotosOnline: Boolean,
    val wantsNewsletter: Boolean = false,
)
@Serializable
data class AdminRegistrationPageResponse(
    val items: List<AdminRegistrationDto>,
    val page: Int,
    val pageSize: Int,
    val totalItems: Long,
    val totalPages: Int,
)

@Serializable
data class AdminRegistrationUpdateRequest(
    val firstName: String,
    val lastName: String,
    val email: String?,
    val roomName: String,
    val slotId: Long,
    val agreesToTermsAndCondition: Boolean,
    val wantsPhotosOnline: Boolean,
    val wantsNewsletter: Boolean = false,
)