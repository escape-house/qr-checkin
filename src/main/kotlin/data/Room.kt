package at.escapehouse.data

import kotlinx.serialization.Serializable

@Serializable
data class Room(
    val id: Long?,
    val name: String?
)