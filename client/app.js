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

    this.planetDisplayCreated = false

    this.init = function(){
        this.postGeoLocation().then((resp)=>{
            return this.getPlanetEphemerides()
        }).then((planetData)=>{
            this.createPlanetDisplay()
            return planetData
        }).then((planetData)=>{
            this.updatePlanetDisplay(planetData)
        })
    }

    this.update = function(){
        if (this.planetDisplayCreated){
            this.getPlanetEphemerides().then((planetData)=>{
                this.updatePlanetDisplay(planetData)
            })
        }
    }

    this.getGeoLocation = function(){
        return new Promise((resolve, reject)=>{
            navigator.geolocation.getCurrentPosition(resolve)
        })
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


    this.postGeoLocation = function(){
        var processCoordinates = (position)=>{
            var postUrl = [
                `lon=${position.coords.longitude}`,
                `lat=${position.coords.latitude}`,
                `elevation=${position.coords.altitude}`
            ]
            return postUrl
        }
        return this.getGeoLocation().then((position)=>{
            console.log(position)
            this.updateGeoLocationDisplay({
                lon: position.coords.longitude,
                lat: position.coords.latitude,
                elevation: position.coords.altitude,
            })
            return position
        }).then((position)=>{
                console.log(`Got geoLocation`)
                var postUrl = processCoordinates(position)
                return this.post("/geo_location", postUrl.join("&"))
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
        var refreshBtn = document.createElement("button")
        refreshBtn.setAttribute("id", "refresh")
        refreshBtn.onclick = this.onRefreshButtonClick()
        refreshBtn.textContent = "Refresh"
        div.appendChild(refreshBtn)
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

    this.updateGeoLocationDisplay = function(geoLocation){
        Object.keys(geoLocation).forEach((key)=>{
            var node = document.getElementById(key)
            node.childNodes[1].textContent = parseFloat(
                geoLocation[key]
            ).toFixed(2)
        })
    }

    this.onRefreshButtonClick = function(){
        return (evt)=>{
            console.log("Refresh button clicked!")
            this.update()
        }
    }

}

document.addEventListener("DOMContentLoaded", (evt)=>{
    var app = new App()
    app.init()
})
