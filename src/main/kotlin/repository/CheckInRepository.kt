package at.escapehouse.repository

import at.escapehouse.data.DeclarationOfConsent
import at.escapehouse.dto.AdminRegistrationUpdateRequest
import java.time.LocalDate

interface CheckInRepository {
    suspend fun insertOne(
        declaration: DeclarationOfConsent,
    )

    suspend fun findByName(
        name: String,
    ): List<DeclarationOfConsent>

    suspend fun findBySlotId(
        slotId: Long,
    ): List<DeclarationOfConsent>

    suspend fun findRegistrations(
        page: Int,
        pageSize: Int,
        name: String?,
        date: LocalDate?,
        slotId: Long?,
        room: String?,
    ): RegistrationPageResult

    suspend fun updateRegistration(
        id: String,
        update: AdminRegistrationUpdateRequest,
    ): DeclarationOfConsent?

    suspend fun deleteRegistration(
        id: String,
    ): Boolean
}