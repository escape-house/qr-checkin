package at.escapehouse.data

import kotlinx.serialization.Serializable

@Serializable
data class Customer(
   val firstName: String?,
   val lastName: String?,
   val companyName: String?
)