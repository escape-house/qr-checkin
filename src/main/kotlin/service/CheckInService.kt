package at.escapehouse.service

import at.escapehouse.data.CheckInForm
import at.escapehouse.data.CheckInResponse
import at.escapehouse.data.DeclarationOfConsent
import at.escapehouse.repository.CheckInRepository

class CheckInService(
    private val checkInRepository: CheckInRepository
) {
    suspend fun checkIn(
        checkInForm: CheckInForm,
        roomName: String,
        slotId: Long? = null
    ): CheckInResponse {
        val normalizedRoomName = roomName.trim()
        val normalizedFirstName = checkInForm.firstName.trim()
        val normalizedLastName = checkInForm.lastName.trim()
        val normalizedEmail = checkInForm.email.trim()

        require(normalizedRoomName.isNotEmpty()) {
            "Room name must not be empty"
        }

        require(normalizedFirstName.isNotEmpty()) {
            "First name must not be empty"
        }

        require(normalizedLastName.isNotEmpty()) {
            "Last name must not be empty"
        }

        require(normalizedEmail.isNotEmpty()) {
            "Email must not be empty"
        }

        require(checkInForm.agreesToTermsAndCondition) {
            "Terms and conditions must be accepted"
        }

        val declaration = DeclarationOfConsent(
            firstName = normalizedFirstName,
            lastName = normalizedLastName,
            email = normalizedEmail,
            agreesToTermsAndCondition =
                checkInForm.agreesToTermsAndCondition,
            wantsPhotosOnline =
                checkInForm.wantsPhotosOnline,
            roomName = normalizedRoomName,
            slotId = slotId?:-1
        )

        checkInRepository.insertOne(declaration)

        return CheckInResponse(
            success = true,
            roomName = normalizedRoomName,
            slotId = slotId
        )
    }
}