var App = function(){

    this.planetNames = [
        "mercury",
        "venus",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune"
    ]

    this.geoLocationIds = [
        "lon",
        "lat",
        "elevation"
    ]

    this.keyUpInterval = 500
    this.keyUpTimer = null
    this.planetDisplayCreated = false
    this.updateInterval = 2000 // update very second and a half
    this.updateTimer = null

    this.init = function(){
        this.updateTimer = this.getPostGeoLocation().then((resp)=>{
            this.initGeoLocationDisplay()
            return resp
        }).then((resp) => {
            return this.getPlanetEphemerides()
        }).then((planetData)=>{
            this.createPlanetDisplay()
            return planetData
        }).then((planetData)=>{
            this.updatePlanetDisplay(planetData)
        }).then(() => {
            return setInterval(
                this.update.bind(this),
                this.updateInterval
            )
        })
    }

    this.update = function(){
        if (this.planetDisplayCreated){
            this.getPlanetEphemerides().then((planetData)=>{
                this.updatePlanetDisplay(planetData)
            })
        }
    }

    this.post = function(url, data){
        var request = new XMLHttpRequest()
        request.open("POST", url, true)
        request.setRequestHeader(
            "Content-Type", "application/x-www-form-urlencoded"
        )
        return new Promise((resolve, reject)=>{
            request.send(data)
            request.onreadystatechange = function(){
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    resolve(this)
                }
            }
            request.onerror = reject
        })
    }

    this.get = function(url){
        var request = new XMLHttpRequest()
        request.open("GET", url, true)
        return new Promise((resolve, reject)=>{
            request.send()
            request.onreadystatechange = function(){
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    resolve(this)
                }
            }
            request.onerror = reject
        })
    }

    this.processCoordinates = function (position) {
        var coordNames = ["longitude", "latitude", "altitude"]
        var coords = coordNames.reduce((obj, name)=>{
            var coord = position.coords[name]
            if (coord === null || isNaN(coord)){
                coord = 0.0
            }
            obj[name] = coord
            return obj
        }, {})
        var postUrl = [
            `lon=${coords.longitude}`,
            `lat=${coords.latitude}`,
            `elevation=${coords.altitude}`
        ]
        return [postUrl, coords]
    }

    this.getGeoLocation = function(){
        return new Promise((resolve, reject)=>{
            navigator.geolocation.getCurrentPosition(resolve)
        })
    }

    this.postGeoLocation = function (postUrlArr) {
        return this.post("/geo_location", postUrlArr.join("&"))
    }

    this.getPostGeoLocation = function(){
        return this.getGeoLocation().then((position) => {
            var [postUrl, coords] = this.processCoordinates(position)
            this.updateGeoLocationDisplay({
                lon: coords.longitude,
                lat: coords.latitude,
                elevation: coords.altitude
            })
            return [postUrl, coords]
        }).then((processedCoordinates)=>{
            return this.postGeoLocation(processedCoordinates[0])
        })
    }

    this.getPlanetEphemeris = function(planetName){
        return this.get(`/planets/${planetName}`).then((req)=>{
            return JSON.parse(req.response)
        })
    }

    this.getPlanetEphemerides = function(){
        return Promise.all(
            this.planetNames.map((name)=>{
                return this.getPlanetEphemeris(name)
            })
        )
    }

    this.createPlanetDisplay = function(){
        var div = document.getElementById("app")
        var table = document.createElement("table")
        var header = document.createElement("tr")
        var headerNames = ["Name", "Azimuth", "Altitude"]
        headerNames.forEach((headerName)=>{
            var headerElement = document.createElement("th")
            headerElement.textContent = headerName
            header.appendChild(headerElement)
        })
        table.appendChild(header)
        this.planetNames.forEach((name)=>{
            var planetRow = document.createElement("tr")
            headerNames.forEach((headerName)=>{
                planetRow.appendChild(
                    document.createElement("td")
                )
            })
            planetRow.setAttribute("id", name)
            table.appendChild(planetRow)
        })
        div.appendChild(table)
        // var refreshBtn = document.createElement("button")
        // refreshBtn.setAttribute("id", "refresh")
        // refreshBtn.onclick = this.onRefreshButtonClick()
        // refreshBtn.textContent = "Refresh"
        // div.appendChild(refreshBtn)
        this.planetDisplayCreated = true
    }


    this.updatePlanetDisplay = function(planetData){
        planetData.forEach((d)=>{
            var content = [d.name, d.az, d.alt]
            var planetRow = document.getElementById(d.name)
            planetRow.childNodes.forEach((node, idx)=>{
                var contentFloat = parseFloat(content[idx])
                if (isNaN(contentFloat)){
                    node.textContent = content[idx]
                } else {
                    node.textContent = contentFloat.toFixed(2)
                }
            })
        })
    }

    this.initGeoLocationDisplay = function () {
        this.geoLocationIds.forEach((id) => {
            var node = document.getElementById(id)
            node.childNodes[1].onkeyup = this.onGeoLocationKeyUp()
        })
        var appNode = document.getElementById("app")
        var resetLocationButton = document.createElement("button")
        resetLocationButton.setAttribute("id", "reset-location")
        resetLocationButton.onclick = this.onResetLocationClick()
        resetLocationButton.textContent = "Reset Geo Location"
        appNode.appendChild(resetLocationButton)
    }

    this.updateGeoLocationDisplay = function(geoLocation){
        Object.keys(geoLocation).forEach((id)=>{
            var node = document.getElementById(id)
            node.childNodes[1].value = parseFloat(
                geoLocation[id]
            ).toFixed(2)
        })
    }

    this.getDisplayedGeoLocation = function () {
        var displayedGeoLocation = this.geoLocationIds.reduce((val, id) => {
            var node = document.getElementById(id)
            var nodeVal = parseFloat(node.childNodes[1].value)
            val[id] = nodeVal
            if (isNaN(nodeVal)) {
                val.valid = false
            }
            return val
        }, {valid: true})
        return displayedGeoLocation
    }

    this.onGeoLocationKeyUp = function () {
        return (evt) => {
            // console.log(evt.key, evt.code)
            var currentTime = new Date()
            if (this.keyUpTimer !== null){
                clearTimeout(this.keyUpTimer)
            }
            this.keyUpTimer = setTimeout(() => {
                var displayedGeoLocation = this.getDisplayedGeoLocation()
                if (displayedGeoLocation.valid) {
                    console.log("Using user supplied geo location")
                    var postUrl = [
                        `lon=${displayedGeoLocation.lon}`,
                        `lat=${displayedGeoLocation.lat}`,
                        `elevation=${displayedGeoLocation.elevation}`
                    ]
                    clearInterval(this.updateTimer)
                    this.postGeoLocation(postUrl)
                        .then(this.update)
                        .then(() => {
                            this.initUpdateTimer()
                            console.log("Successfully changed geo location")
                         })
                }
            }, this.keyUpInterval)
        }
    }

    this.onRefreshButtonClick = function () {
        return (evt) => {
            console.log("Refresh button clicked!")
            this.update()
        }
    }

    this.onResetLocationClick = function () {
        return (evt) => {
            console.log("Geo location reset clicked")
            clearInterval(this.updateTimer)
            this.getPostGeoLocation().then(this.update).then(() => {
                this.initUpdateTimer()
                console.log("Successfully reset geo location")
            })
        }
    }

    this.initUpdateTimer = function () {
        if (this.updateTimer !== null){
            clearInterval(this.updateTimer)
        }
        this.updateTimer = setInterval(
            this.update.bind(this),
            this.updateInterval
        )
        return this.updateTimer
    }

    this.testPerformance = function(n){
        var t0 = performance.now()
        var promises = []
        for (var i=0; i<n; i++){
            promises.push(this.getPlanetEphemeris("mars"))
        }
        Promise.all(promises).then(()=>{
            var delta = (performance.now() - t0)/1000
            console.log(`Took ${delta.toFixed(4)} seconds to do ${n} requests`)
        })
    }
}

var app
document.addEventListener("DOMContentLoaded", (evt)=>{
    app = new App()
    app.init()
})
