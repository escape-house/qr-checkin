package at.escapehouse.repository

import at.escapehouse.data.DeclarationOfConsent
import at.escapehouse.dto.AdminRegistrationUpdateRequest
import com.mongodb.client.model.Filters
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.model.Sorts
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.toList
import org.bson.BsonDocument
import org.bson.conversions.Bson
import org.bson.types.ObjectId
import java.time.LocalDate
import java.util.regex.Pattern

class MongoCheckInRepositoryImpl(
    database: MongoDatabase,
) : CheckInRepository {

    private val collection =
        database.getCollection<DeclarationOfConsent>(
            "declarationsOfConsent"
        )

    override suspend fun insertOne(
        declaration: DeclarationOfConsent,
    ) {
        collection.insertOne(declaration)
    }

    override suspend fun findByName(
        name: String,
    ): List<DeclarationOfConsent> {
        return collection
            .find(Filters.eq("lastName", name))
            .toList()
    }

    override suspend fun findBySlotId(
        slotId: Long,
    ): List<DeclarationOfConsent> {
        return collection
            .find(Filters.eq("slotId", slotId))
            .toList()
    }

    override suspend fun findRegistrations(
        page: Int,
        pageSize: Int,
        name: String?,
        date: LocalDate?,
        slotId: Long?,
        room: String?,
    ): RegistrationPageResult {
        val filter = createRegistrationFilter(
            name = name,
            date = date,
            slotId = slotId,
            room = room,
        )

        val totalItems =
            collection.countDocuments(filter)

        val items = collection
            .find(filter)
            .sort(Sorts.descending("createdAt"))
            .skip(page * pageSize)
            .limit(pageSize)
            .toList()

        return RegistrationPageResult(
            items = items,
            totalItems = totalItems,
        )
    }

    override suspend fun updateRegistration(
        id: String,
        update: AdminRegistrationUpdateRequest,
    ): DeclarationOfConsent? {
        if (!ObjectId.isValid(id)) {
            return null
        }

        val mongoUpdate = Updates.combine(
            Updates.set(
                "firstName",
                update.firstName,
            ),
            Updates.set(
                "lastName",
                update.lastName,
            ),
            Updates.set(
                "email",
                update.email,
            ),
            Updates.set(
                "roomName",
                update.roomName,
            ),
            Updates.set(
                "slotId",
                update.slotId,
            ),
            Updates.set(
                "agreesToTermsAndCondition",
                update.agreesToTermsAndCondition,
            ),
            Updates.set(
                "wantsPhotosOnline",
                update.wantsPhotosOnline,
            ),
        )

        return collection.findOneAndUpdate(
            Filters.eq(
                "_id",
                ObjectId(id),
            ),
            mongoUpdate,
            FindOneAndUpdateOptions()
                .returnDocument(ReturnDocument.AFTER),
        )
    }

    override suspend fun deleteRegistration(
        id: String,
    ): Boolean {
        if (!ObjectId.isValid(id)) {
            return false
        }

        val result = collection.deleteOne(
            Filters.eq(
                "_id",
                ObjectId(id),
            )
        )

        return result.deletedCount > 0
    }

    private fun createRegistrationFilter(
        name: String?,
        date: LocalDate?,
        slotId: Long?,
        room: String?,
    ): Bson {
        val filters = mutableListOf<Bson>()

        val normalizedName = name
            ?.trim()
            ?.takeIf(String::isNotEmpty)

        if (normalizedName != null) {
            val nameParts = normalizedName
                .split(Regex("\\s+"))

            nameParts.forEach { namePart ->
                val pattern = Pattern.compile(
                    Pattern.quote(namePart),
                    Pattern.CASE_INSENSITIVE,
                )

                filters += Filters.or(
                    Filters.regex("firstName", pattern),
                    Filters.regex("lastName", pattern),
                )
            }
        }

        if (date != null) {
            val dayStart = date.atStartOfDay()
            val nextDayStart = date.plusDays(1).atStartOfDay()

            filters += Filters.gte("createdAt", dayStart)
            filters += Filters.lt("createdAt", nextDayStart)
        }

        if (slotId != null) {
            filters += Filters.eq("slotId", slotId)
        }

        if (room != null) {
            filters += Filters.regex(
                "roomName",
                Pattern.compile(Pattern.quote(room), Pattern.CASE_INSENSITIVE),
            )
        }

        return when (filters.size) {
            0 -> BsonDocument()
            1 -> filters.first()
            else -> Filters.and(filters)
        }
    }
}