package at.escapehouse.data

import kotlinx.serialization.Serializable

@Serializable
data class CheckInForm(
    val firstName: String,
    val lastName: String,
    val email: String?,
    val agreesToTermsAndCondition: Boolean,
    val wantsPhotosOnline: Boolean,
    val wantsNewsletter: Boolean = false,
)
