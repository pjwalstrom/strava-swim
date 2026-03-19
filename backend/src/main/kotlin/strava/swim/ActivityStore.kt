package strava.swim

import kotlinx.serialization.json.Json
import java.io.File

class ActivityStore {

    private val json = Json { prettyPrint = true }
    private val file = File("data/activities.json")
    private val lock = Any()

    fun loadAll(): List<SwimActivity> {
        if (!file.exists()) return emptyList()
        val text = file.readText()
        if (text.isBlank()) return emptyList()
        return json.decodeFromString<List<SwimActivity>>(text)
    }

    fun save(activity: SwimActivity) {
        synchronized(lock) {
            val activities = loadAll().toMutableList()
            activities.removeAll { it.id == activity.id }
            activities.add(activity)
            file.parentFile?.mkdirs()
            file.writeText(json.encodeToString(activities))
        }
    }
}
