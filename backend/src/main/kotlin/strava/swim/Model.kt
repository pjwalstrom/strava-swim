package strava.swim

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class SwimActivity(
    val id: Long,
    val name: String,
    val date: String,
    val avgPace100m: Double,
    val distance: Double,
    val laps: Int,
    val elapsedTime: Int = 0
)

@Serializable
data class AddActivityRequest(val stravaId: Long)

@Serializable
data class UpdateActivityRequest(val distance: Double)

@Serializable
data class StravaActivity(
    val id: Long,
    val name: String,
    @SerialName("start_date_local") val startDateLocal: String,
    val type: String,
    val distance: Double
)

@Serializable
data class StravaLap(
    @SerialName("elapsed_time") val elapsedTime: Int,
    val distance: Double
)
