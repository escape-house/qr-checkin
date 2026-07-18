package at.escapehouse.data

import kotlinx.serialization.Serializable

@Serializable
data class CheckInResponse(
    val success: Boolean,
    val roomName: String,
    val slotId: Long?
)