package at.escapehouse.data

import kotlinx.serialization.Serializable
import org.bson.BsonType
import org.bson.codecs.pojo.annotations.BsonId
import org.bson.codecs.pojo.annotations.BsonRepresentation
import org.bson.types.ObjectId
import java.time.LocalDate
import java.time.LocalDateTime

@Serializable
data class DeclarationOfConsent(
    @BsonId
    @BsonRepresentation(BsonType.OBJECT_ID)
    val id: String = ObjectId().toHexString(),

    val firstName: String,
    val lastName: String,
    val email: String?,
    val agreesToTermsAndCondition: Boolean,
    val wantsPhotosOnline: Boolean,
    val wantsNewsletter: Boolean = false,
    val roomName: String,
    val slotId: Long?,
    @Serializable(with = LocalDateSerializer::class)
    val createdAt: LocalDateTime = LocalDateTime.now()
){
}