package at.escapehouse.repository

import at.escapehouse.data.DeclarationOfConsent
import at.escapehouse.data.MongoCounter
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Updates.inc
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

class MongoCheckInRepositoryImpl(
    database: MongoDatabase
) : CheckInRepository {
    private val collection: MongoCollection<DeclarationOfConsent> =
        database.getCollection(
            COLLECTION_NAME
        )

    override suspend fun insertOne(
        declaration: DeclarationOfConsent
    ) {
        collection.insertOne(declaration)
    }

    override suspend fun findByName(
        name: String
    ): List<DeclarationOfConsent> {
        return collection
            .find(eq("lastName", name))
            .toList()
    }

    override suspend fun findBySlotId(
        slotId: Long
    ): List<DeclarationOfConsent> {
        return collection
            .find(eq("slotId", slotId))
            .toList()
    }

    private companion object {
        const val COLLECTION_NAME =
            "declarationsOfConsent"
    }
}