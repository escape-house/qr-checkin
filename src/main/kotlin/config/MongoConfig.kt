package at.escapehouse.config

import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationStopped
import io.ktor.server.config.ApplicationConfig

data class MongoConfig(
    val connectionString: String,
    val databaseName: String
)

fun provideMongoConfig(
    config: ApplicationConfig
): MongoConfig {
    return MongoConfig(
        connectionString = config
            .property("mongodb.connectionString")
            .getString(),

        databaseName = config
            .property("mongodb.database")
            .getString()
    )
}

fun provideMongoDatabase(
    mongoConfig: MongoConfig,
    application: Application
): MongoDatabase {
    val client = MongoClient.create(
        mongoConfig.connectionString
    )

    application.monitor.subscribe(ApplicationStopped) {
        client.close()
    }

    return client.getDatabase(
        mongoConfig.databaseName
    )
}