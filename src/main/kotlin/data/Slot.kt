package at.escapehouse.data

import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Slot(
    val id: Long?,
    val isAvailable: Boolean,
    @Serializable(with = LocalDateSerializer::class)
    val start: LocalDateTime,
    @Serializable(with = LocalDateSerializer::class)
    val end: LocalDateTime,
    val players: Int?,
    //
    val type: String?,
    val customer: Customer?,
    val room: Room,
    val comment: String? = null,
    val language: String? = null
)