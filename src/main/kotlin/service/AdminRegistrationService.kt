package at.escapehouse.service

import at.escapehouse.data.DeclarationOfConsent
import at.escapehouse.dto.AdminRegistrationDto
import at.escapehouse.dto.AdminRegistrationPageResponse
import at.escapehouse.dto.AdminRegistrationUpdateRequest
import at.escapehouse.repository.CheckInRepository
import java.time.LocalDate
import kotlin.math.ceil

class AdminRegistrationService(
    private val repository: CheckInRepository,
) {

    suspend fun getRegistrations(
        page: Int,
        pageSize: Int,
        name: String?,
        date: LocalDate?,
        slotId: Long? = null
    ): AdminRegistrationPageResponse {
        require(page >= 0) {
            "Page must not be negative"
        }

        require(pageSize in 1..100) {
            "Page size must be between 1 and 100"
        }

        val result = repository.findRegistrations(
            page = page,
            pageSize = pageSize,
            name = name,
            date = date,
            slotId = slotId
        )

        val totalPages =
            if (result.totalItems == 0L) {
                0
            } else {
                ceil(
                    result.totalItems.toDouble() /
                            pageSize.toDouble()
                ).toInt()
            }

        return AdminRegistrationPageResponse(
            items = result.items.map(
                DeclarationOfConsent::toAdminDto
            ),
            page = page,
            pageSize = pageSize,
            totalItems = result.totalItems,
            totalPages = totalPages,
        )
    }

    suspend fun updateRegistration(
        id: String,
        request: AdminRegistrationUpdateRequest,
    ): AdminRegistrationDto? {
        require(id.isNotBlank()) {
            "Missing registration id"
        }

        val normalizedRequest =
            request.validatedAndNormalized()

        return repository
            .updateRegistration(
                id = id,
                update = normalizedRequest,
            )
            ?.toAdminDto()
    }

    suspend fun deleteRegistration(
        id: String,
    ): Boolean {
        require(id.isNotBlank()) {
            "Missing registration id"
        }

        return repository.deleteRegistration(id)
    }

    private fun AdminRegistrationUpdateRequest
            .validatedAndNormalized():
            AdminRegistrationUpdateRequest {

        val normalizedFirstName =
            firstName.trim()

        val normalizedLastName =
            lastName.trim()

        val normalizedEmail =
            email.trim().lowercase()

        val normalizedRoomName =
            roomName.trim()

        require(normalizedFirstName.isNotEmpty()) {
            "First name must not be empty"
        }

        require(normalizedLastName.isNotEmpty()) {
            "Last name must not be empty"
        }

        require(normalizedEmail.isNotEmpty()) {
            "Email must not be empty"
        }

        require('@' in normalizedEmail) {
            "Invalid email address"
        }

        require(normalizedRoomName.isNotEmpty()) {
            "Room name must not be empty"
        }

        require(slotId > 0) {
            "Slot ID must be greater than zero"
        }

        return copy(
            firstName = normalizedFirstName,
            lastName = normalizedLastName,
            email = normalizedEmail,
            roomName = normalizedRoomName,
        )
    }
}

private fun DeclarationOfConsent.toAdminDto() =
    AdminRegistrationDto(
        id = id,
        firstName = firstName,
        lastName = lastName,
        email = email,
        roomName = roomName,
        slotId = slotId?:-1,
        registrationDate = createdAt,
        agreesToTermsAndCondition =
            agreesToTermsAndCondition,
        wantsPhotosOnline =
            wantsPhotosOnline,
    )