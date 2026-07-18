package at.escapehouse.repository

import at.escapehouse.data.DeclarationOfConsent

interface CheckInRepository {

    suspend fun insertOne(doc: DeclarationOfConsent)

    suspend fun findByName(name: String): List<DeclarationOfConsent>

    suspend fun findBySlotId(slotId: Long): List<DeclarationOfConsent>
}