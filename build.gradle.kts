import org.gradle.api.tasks.Exec
import org.gradle.api.tasks.Sync

plugins {
    kotlin("plugin.serialization") version "2.2.0"
    alias(libs.plugins.kotlin.jvm)
    alias(ktorLibs.plugins.ktor)
}

group = "at.escapehouse"
version = "1.0.0-SNAPSHOT"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")}

kotlin {
    jvmToolchain(21)
}
dependencies {
    implementation(ktorLibs.server.config.yaml)
    implementation(ktorLibs.server.core)
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    implementation(ktorLibs.client.logging)
    implementation(ktorLibs.server.di)
    implementation(ktorLibs.server.netty)
    implementation(libs.logback.classic)
    implementation("io.ktor:ktor-server-content-negotiation:3.5.0")
    implementation("io.ktor:ktor-client-content-negotiation:3.5.0")
    implementation("io.ktor:ktor-serialization-kotlinx-json:3.5.0")
    implementation("io.ktor:ktor-server-cors:3.5.0")
    implementation("io.ktor:ktor-server-auth:3.5.0")
    implementation("io.ktor:ktor-server-sessions:3.5.0")
    // MongoDB
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:5.9.0")
    implementation("io.ktor:ktor-server-status-pages:3.5.0")

    testImplementation(kotlin("test"))
    testImplementation(ktorLibs.server.testHost)
}

val frontendDirectory = layout.projectDirectory.dir("frontend")
val frontendDistDirectory = frontendDirectory.dir("dist")

val generatedResourcesDirectory =
    layout.buildDirectory.dir("generated-resources/main")

val generatedReactDirectory =
    generatedResourcesDirectory.map { it.dir("frontend_build") }

val npmExecutable =
    if (System.getProperty("os.name").startsWith("Windows", ignoreCase = true)) {
        "npm.cmd"
    } else {
        "npm"
    }

val npmInstall by tasks.registering(Exec::class) {
    workingDir(frontendDirectory.asFile)
    commandLine(npmExecutable, "ci")

    inputs.files(
        frontendDirectory.file("package.json"),
        frontendDirectory.file("package-lock.json")
    )
    outputs.dir(frontendDirectory.dir("node_modules"))
}

val npmBuild by tasks.registering(Exec::class) {
    dependsOn(npmInstall)

    workingDir(frontendDirectory.asFile)
    commandLine(npmExecutable, "run", "build")

    inputs.files(
        fileTree(frontendDirectory) {
            exclude(
                "node_modules/**",
                "dist/**"
            )
        }
    )

    outputs.dir(frontendDistDirectory)
}

val copyFrontend by tasks.registering(Sync::class) {
    dependsOn(npmBuild)

    from(frontendDistDirectory)
    into(generatedReactDirectory)
    doLast {
        logger.lifecycle(
            "Frontend copied to: ${generatedReactDirectory.get().asFile}"
        )
    }
}

sourceSets {
    main {
        resources.srcDir(generatedResourcesDirectory)
    }
}

tasks.named("processResources") {
    dependsOn(copyFrontend)
}

val dotEnvFile = layout.projectDirectory.file(".env")

fun parseDotEnv(content: String): Map<String, String> =
    content.lineSequence()
        .mapIndexedNotNull { index, rawLine ->
            val line = rawLine.trim()

            if (line.isEmpty() || line.startsWith("#")) {
                return@mapIndexedNotNull null
            }

            val normalizedLine =
                line.removePrefix("export ").trim()

            val separatorIndex = normalizedLine.indexOf('=')

            require(separatorIndex > 0) {
                "Invalid .env entry on line ${index + 1}: $rawLine"
            }

            val key =
                normalizedLine.substring(0, separatorIndex).trim()

            require(key.matches(Regex("[A-Za-z_][A-Za-z0-9_]*"))) {
                "Invalid environment variable name '$key' on line ${index + 1}"
            }

            val value =
                normalizedLine
                    .substring(separatorIndex + 1)
                    .trim()
                    .removeSurrounding("\"")
                    .removeSurrounding("'")

            key to value
        }
        .toMap()

val dotEnvVariables =
    providers.fileContents(dotEnvFile)
        .asText
        .map(::parseDotEnv)

tasks.withType<JavaExec>().configureEach {
    val javaExecTask = this

    inputs.file(dotEnvFile)

    doFirst {
        javaExecTask.environment(dotEnvVariables.get())
    }
}