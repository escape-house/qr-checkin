package at.escapehouse.data

data class DeclarationOfConsent(
    val firstName: String,
    val lastName: String,
    val email: String,
    val agreesToTermsAndCondition: Boolean,
    val wantsPhotosOnline: Boolean,
    val roomName: String,
    val slotId: Long?,
    val createdAt: Long =  System.currentTimeMillis()
){
}