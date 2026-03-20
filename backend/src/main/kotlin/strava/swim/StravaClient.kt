package strava.swim

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

class StravaApiException(val statusCode: Int, message: String) : RuntimeException(message)

@Serializable
private data class TokenResponse(
    @SerialName("access_token") val accessToken: String,
    @SerialName("expires_at") val expiresAt: Long
)

class StravaClient {

    private val clientId = config("STRAVA_CLIENT_ID")
    private val clientSecret = config("STRAVA_CLIENT_SECRET")
    private val refreshToken = config("STRAVA_REFRESH_TOKEN")

    private var accessToken: String? = null
    private var expiresAt: Long = 0

    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    private val log = org.slf4j.LoggerFactory.getLogger("StravaClient")

    private suspend fun ensureToken(): String {
        val now = System.currentTimeMillis() / 1000
        if (accessToken != null && now < expiresAt - 60) return accessToken!!

        log.info("Refreshing Strava access token")
        val response = client.submitForm(
            url = "https://www.strava.com/oauth/token",
            formParameters = parameters {
                append("client_id", clientId)
                append("client_secret", clientSecret)
                append("refresh_token", refreshToken)
                append("grant_type", "refresh_token")
            }
        )
        if (!response.status.isSuccess()) {
            val body = response.bodyAsText()
            throw StravaApiException(response.status.value, "Token refresh failed: $body")
        }
        val token = response.body<TokenResponse>()
        accessToken = token.accessToken
        expiresAt = token.expiresAt
        log.info("Token refreshed, expires at $expiresAt")
        return token.accessToken
    }

    private suspend fun checkResponse(response: HttpResponse) {
        if (response.status.isSuccess()) return
        val body = response.bodyAsText()
        log.warn("Strava API ${response.status.value}: $body")
        throw StravaApiException(response.status.value, "Strava ${response.status.value}: $body")
    }

    suspend fun getActivity(id: Long): StravaActivity {
        val token = ensureToken()
        val response = client.get("https://www.strava.com/api/v3/activities/$id") {
            header("Authorization", "Bearer $token")
        }
        checkResponse(response)
        return response.body()
    }

    suspend fun getLaps(id: Long): List<StravaLap> {
        val token = ensureToken()
        val response = client.get("https://www.strava.com/api/v3/activities/$id/laps") {
            header("Authorization", "Bearer $token")
        }
        checkResponse(response)
        return response.body()
    }

    suspend fun getAthleteSwimActivities(): List<StravaActivitySummary> {
        val allSwims = mutableListOf<StravaActivitySummary>()
        var page = 1
        val perPage = 200

        while (true) {
            val token = ensureToken()
            val response = client.get("https://www.strava.com/api/v3/athlete/activities") {
                header("Authorization", "Bearer $token")
                parameter("page", page)
                parameter("per_page", perPage)
            }
            checkResponse(response)
            val activities = response.body<List<StravaActivity>>()

            if (activities.isEmpty()) break

            activities
                .filter { it.type == "Swim" }
                .mapTo(allSwims) {
                    StravaActivitySummary(
                        id = it.id,
                        name = it.name,
                        date = it.startDateLocal.substringBefore("T"),
                        distance = it.distance
                    )
                }

            if (activities.size < perPage) break
            page++
            log.info("Fetched page $page of athlete activities")
        }

        log.info("Found ${allSwims.size} swim activities")
        return allSwims.sortedBy { it.date }
    }
}
