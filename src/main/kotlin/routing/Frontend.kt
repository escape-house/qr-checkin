package at.escapehouse.routing

import io.ktor.server.http.content.singlePageApplication
import io.ktor.server.routing.Route

fun Route.fronted(){
    singlePageApplication {
        useResources = true
        filesPath = "frontend_build"
        defaultPage = "index.html"
    }
}
