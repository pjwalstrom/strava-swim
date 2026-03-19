package strava.swim

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRoutes(stravaClient: StravaClient, store: ActivityStore) {
    routing {
        get("/api/activities") {
            val activities = store.loadAll().sortedByDescending { it.date }
            log.info("GET /api/activities → ${activities.size} activities")
            call.respond(activities)
        }

        post("/api/activities") {
            val request = call.receive<AddActivityRequest>()
            log.info("POST /api/activities → fetching Strava activity ${request.stravaId}")

            val stravaActivity = try {
                stravaClient.getActivity(request.stravaId)
            } catch (e: StravaApiException) {
                log.warn("Strava API error for activity ${request.stravaId}: ${e.message}")
                val status = if (e.statusCode == 404) HttpStatusCode.NotFound else HttpStatusCode.BadGateway
                call.respond(status, mapOf("error" to e.message))
                return@post
            }

            log.info("Activity ${request.stravaId}: type=${stravaActivity.type}, name=${stravaActivity.name}")

            if (stravaActivity.type != "Swim") {
                log.warn("Activity ${request.stravaId} is not a swim (type=${stravaActivity.type})")
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Activity is not a swim"))
                return@post
            }

            val laps = stravaClient.getLaps(request.stravaId)
                .filter { it.distance > 0 }

            val totalElapsedTime = laps.sumOf { it.elapsedTime }
            val totalLapDistance = laps.sumOf { it.distance }

            val avgPace100m = if (totalLapDistance > 0) {
                (totalElapsedTime.toDouble() / totalLapDistance) * 100.0
            } else {
                0.0
            }

            val dateOnly = stravaActivity.startDateLocal.substringBefore("T")

            val swimActivity = SwimActivity(
                id = stravaActivity.id,
                name = stravaActivity.name,
                date = dateOnly,
                avgPace100m = avgPace100m,
                distance = stravaActivity.distance,
                laps = laps.size,
                elapsedTime = totalElapsedTime
            )

            store.save(swimActivity)
            log.info("Saved activity ${swimActivity.id}: ${swimActivity.name}, pace=${avgPace100m}s/100m, ${laps.size} laps")
            call.respond(HttpStatusCode.Created, swimActivity)
        }

        put("/api/activities/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid activity ID"))
                return@put
            }

            val existing = store.loadAll().find { it.id == id }
            if (existing == null) {
                call.respond(HttpStatusCode.NotFound, mapOf("error" to "Activity not found"))
                return@put
            }

            val request = call.receive<UpdateActivityRequest>()

            // Derive elapsed time from existing pace if not stored (legacy data)
            val elapsed = if (existing.elapsedTime > 0) {
                existing.elapsedTime.toDouble()
            } else {
                existing.avgPace100m * existing.distance / 100.0
            }

            val newPace = if (request.distance > 0 && elapsed > 0) {
                (elapsed / request.distance) * 100.0
            } else {
                existing.avgPace100m
            }

            val updated = existing.copy(
                distance = request.distance,
                avgPace100m = newPace,
                elapsedTime = elapsed.toInt()
            )
            store.save(updated)
            log.info("Updated activity $id: distance=${request.distance}, newPace=${newPace}s/100m")
            call.respond(updated)
        }

        delete("/api/activities/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid activity ID"))
                return@delete
            }
            store.delete(id)
            log.info("Deleted activity $id")
            call.respond(HttpStatusCode.NoContent)
        }
    }
}
