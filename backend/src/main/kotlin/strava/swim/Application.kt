package strava.swim

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import kotlinx.serialization.json.Json
import java.io.File

fun loadEnv(path: String = ".env") {
    val file = File(path)
    if (!file.exists()) return
    file.readLines()
        .map { it.trim() }
        .filter { it.isNotEmpty() && !it.startsWith("#") && '=' in it }
        .forEach { line ->
            val (key, value) = line.split("=", limit = 2)
            if (System.getProperty(key.trim()) == null && System.getenv(key.trim()) == null) {
                System.setProperty(key.trim(), value.trim())
            }
        }
}

fun config(key: String): String =
    System.getenv(key) ?: System.getProperty(key) ?: error("$key not configured")

fun main() {
    loadEnv()
    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            json(Json { prettyPrint = true })
        }
        install(CORS) {
            allowHost("localhost:5173")
            allowHeader(HttpHeaders.ContentType)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Delete)
        }
        install(StatusPages) {
            exception<IllegalStateException> { call, cause ->
                if (cause.message?.contains("STRAVA_ACCESS_TOKEN") == true) {
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        mapOf("error" to "STRAVA_ACCESS_TOKEN not configured")
                    )
                } else {
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        mapOf("error" to (cause.message ?: "Internal server error"))
                    )
                }
            }
            exception<Exception> { call, cause ->
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to (cause.message ?: "Internal server error"))
                )
            }
        }

        val stravaClient = StravaClient()
        val store = ActivityStore()
        configureRoutes(stravaClient, store)
    }.start(wait = true)
}
