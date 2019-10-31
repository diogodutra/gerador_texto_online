var App = function(){

    // this.planetNames = [
    //     "mercury",
    //     "venus",
    //     "mars",
    //     "jupiter",
    //     "saturn",
    //     "uranus",
    //     "neptune"
    // ]

    // this.geoLocationIds = [
    //     "lon",
    //     "lat",
    //     "elevation"
    // ]

    // this.keyUpInterval = 500
    // this.keyUpTimer = null
    // this.planetDisplayCreated = false
    // this.updateInterval = 2000 // update very second and a half
    // this.updateTimer = null
    // this.geoLocation = null

    // this.init = function(){
    //     this.getGeoLocation().then((position) => {
    //         var coords = this.processCoordinates(position)
    //         this.geoLocation = coords
    //         this.initGeoLocationDisplay()
    //         this.updateGeoLocationDisplay()
    //         return this.getPlanetEphemerides()
    //     }).then((planetData) => {
    //         this.createPlanetDisplay()
    //         this.updatePlanetDisplay(planetData)
    //     }).then(() => {
    //         return this.initUpdateTimer()
    //     })
    // }

    // this.update = function(){
    //     if (this.planetDisplayCreated){
    //         this.getPlanetEphemerides().then((planetData)=>{
    //             this.updatePlanetDisplay(planetData)
    //         })
    //     }
    // }

    // this.post = function(url, data){
    //     var request = new XMLHttpRequest()
    //     request.open("POST", url, true)
    //     request.setRequestHeader(
    //         "Content-Type", "application/x-www-form-urlencoded"
    //     )
    //     return new Promise((resolve, reject)=>{
    //         request.send(data)
    //         request.onreadystatechange = function(){
    //             if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    //                 resolve(this)
    //             }
    //         }
    //         request.onerror = reject
    //     })
    // }

    // this.get = function(url, data){
    //     var request = new XMLHttpRequest()
    //     if (data !== undefined){
    //         url += `?${data}`
    //     }
    //     // console.log(`get: ${url}`)
    //     request.open("GET", url, true)
    //     return new Promise((resolve, reject)=>{
    //         request.send()
    //         request.onreadystatechange = function(){
    //             if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    //                 resolve(this)
    //             }
    //         }
    //         request.onerror = reject
    //     })
    // }

    // this.processCoordinates = function (position) {
    //     var coordMap = {
    //         'longitude': 'lon',
    //         'latitude': 'lat',
    //         'altitude': 'elevation'
    //     }
    //     var coords = Object.keys(coordMap).reduce((obj, name)=>{
    //         var coord = position.coords[name]
    //         if (coord === null || isNaN(coord)){
    //             coord = 0.0
    //         }
    //         obj[coordMap[name]] = coord
    //         return obj
    //     }, {})
    //     return coords
    // }

    // this.coordDataUrl = function (coords) {
    //     postUrl = Object.keys(coords).map((c) => {
    //         return `${c}=${coords[c]}`
    //     })
    //     return postUrl
    // }

    // this.getGeoLocation = function(){
    //     return new Promise((resolve, reject)=>{
    //         navigator.geolocation.getCurrentPosition(resolve)
    //     })
    // }

    // this.getPlanetEphemeris = function(planetName){
    //     var postUrlArr = this.coordDataUrl(this.geoLocation)
    //     return this.get(`/planets/${planetName}`, postUrlArr.join("&")).then((req)=>{
    //         return JSON.parse(req.response)
    //     })
    // }

    // this.getPlanetEphemerides = function(){
    //     return Promise.all(
    //         this.planetNames.map((name)=>{
    //             return this.getPlanetEphemeris(name)
    //         })
    //     )
    // }

    // this.createPlanetDisplay = function(){
    //     var div = document.getElementById("app")
    //     var table = document.createElement("table")
    //     var header = document.createElement("tr")
    //     var headerNames = ["Name", "Azimuth", "Altitude"]
    //     headerNames.forEach((headerName)=>{
    //         var headerElement = document.createElement("th")
    //         headerElement.textContent = headerName
    //         header.appendChild(headerElement)
    //     })
    //     table.appendChild(header)
    //     this.planetNames.forEach((name)=>{
    //         var planetRow = document.createElement("tr")
    //         headerNames.forEach((headerName)=>{
    //             planetRow.appendChild(
    //                 document.createElement("td")
    //             )
    //         })
    //         planetRow.setAttribute("id", name)
    //         table.appendChild(planetRow)
    //     })
    //     div.appendChild(table)
    //     this.planetDisplayCreated = true
    // }

    // this.updatePlanetDisplay = function(planetData){
    //     planetData.forEach((d)=>{
    //         var content = [d.name, d.az, d.alt]
    //         var planetRow = document.getElementById(d.name)
    //         planetRow.childNodes.forEach((node, idx)=>{
    //             var contentFloat = parseFloat(content[idx])
    //             if (isNaN(contentFloat)){
    //                 node.textContent = content[idx]
    //             } else {
    //                 node.textContent = contentFloat.toFixed(2)
    //             }
    //         })
    //     })
    // }

    // this.initGeoLocationDisplay = function () {
    //     this.geoLocationIds.forEach((id) => {
    //         var node = document.getElementById(id)
    //         node.childNodes[1].onkeyup = this.onGeoLocationKeyUp()
    //     })
    //     var appNode = document.getElementById("app")
    //     var resetLocationButton = document.createElement("button")
    //     resetLocationButton.setAttribute("id", "reset-location")
    //     resetLocationButton.onclick = this.onResetLocationClick()
    //     resetLocationButton.textContent = "Reset Geo Location"
    //     appNode.appendChild(resetLocationButton)
    // }

    // this.updateGeoLocationDisplay = function(){
    //     Object.keys(this.geoLocation).forEach((id)=>{
    //         var node = document.getElementById(id)
    //         node.childNodes[1].value = parseFloat(
    //             this.geoLocation[id]
    //         ).toFixed(2)
    //     })
    // }

    // this.getDisplayedGeoLocation = function () {
    //     var displayedGeoLocation = this.geoLocationIds.reduce((val, id) => {
    //         var node = document.getElementById(id)
    //         var nodeVal = parseFloat(node.childNodes[1].value)
    //         val[id] = nodeVal
    //         if (isNaN(nodeVal)) {
    //             val.valid = false
    //         }
    //         return val
    //     }, {valid: true})
    //     return displayedGeoLocation
    // }

    // this.onGeoLocationKeyUp = function () {
    //     return (evt) => {
    //         // console.log(evt.key, evt.code)
    //         var currentTime = new Date()
    //         if (this.keyUpTimer !== null){
    //             clearTimeout(this.keyUpTimer)
    //         }
    //         this.keyUpTimer = setTimeout(() => {
    //             var displayedGeoLocation = this.getDisplayedGeoLocation()
    //             if (displayedGeoLocation.valid) {
    //                 delete displayedGeoLocation.valid
    //                 this.geoLocation = displayedGeoLocation
    //                 console.log("Using user supplied geo location")
    //             }
    //         }, this.keyUpInterval)
    //     }
    // }

    // this.onResetLocationClick = function () {
    //     return (evt) => {
    //         console.log("Geo location reset clicked")
    //         this.getGeoLocation().then((coords) => {
    //             this.geoLocation = this.processCoordinates(coords)
    //             this.updateGeoLocationDisplay()
    //         })
    //     }
    // }

    // this.initUpdateTimer = function () {
    //     if (this.updateTimer !== null){
    //         clearInterval(this.updateTimer)
    //     }
    //     this.updateTimer = setInterval(
    //         this.update.bind(this),
    //         this.updateInterval
    //     )
    //     return this.updateTimer
    // }

    // this.testPerformance = function(n){
    //     var t0 = performance.now()
    //     var promises = []
    //     for (var i=0; i<n; i++){
    //         promises.push(this.getPlanetEphemeris("mars"))
    //     }
    //     Promise.all(promises).then(()=>{
    //         var delta = (performance.now() - t0)/1000
    //         console.log(`Took ${delta.toFixed(4)} seconds to do ${n} requests`)
    //     })
    // }
    
    // this.updatePlanetDisplay = function(planetData){
    //     planetData.forEach((d)=>{
    //         var content = [d.name, d.az, d.alt]
    //         var planetRow = document.getElementById(d.name)
    //         planetRow.childNodes.forEach((node, idx)=>{
    //             var contentFloat = parseFloat(content[idx])
    //             if (isNaN(contentFloat)){
    //                 node.textContent = content[idx]
    //             } else {
    //                 node.textContent = contentFloat.toFixed(2)
    //             }
    //         })
    //     })
    // }
    

    // DD
    this.id_text = "text"
    this.id_keywords = "keywords"
    this.id_button = "button"

    this.getTexts = function(keywords) {
    // inspiration: this.getPlanetEphemeris = function(planetName){
        alert("getTexts: ".concat(keywords))
        return this.get(`/blogger/${keywords}`).then((req) => {
            return JSON.parse(req.response)
        })
    }

    this.updateTexts = function(Texts) {
        // inspiration: this.updatePlanetDisplay = function(planetData){
        alert("updateTexts")
        title.value = "Titulo 2"
        text.value = "Texto 2"
        var title = document.getElementById(this.id_title)
        var text = document.getElementById(this.id_text)
        // alert("for: ".concat(showProps(Texts[0], "Texts")))
        // Texts.forEach((t)=>{
        for (var i in Texts) {
            alert("for: ".concat(showProps(Texts[i], "Texts")))
            // var new_title = Texts[i].title
            // var new_text = Texts[i].text
            // if (isNaN(t.title)) {
                // title.value = ""
            // } else {
                // title.value = t.title
            // }
            // if (isNaN(t.text)) {
                // text.value = ""
            // } else {
                // text.value = t.text
            // }
            title.value = Texts[i].title
            text.value = Texts[i].text
        }//)
    }

    this.blog = function() {
    // inspiration: this.update = function(){
    //TODO: delete previous created Texts
    //TODO: create N new texts and titles
        var keywords = document.getElementById(this.id_keywords).value
        if (keywords) {
            this.getTexts(keywords).then((Texts) => {
                // this.createTexts(Texts).then((Texts) => {
                    // alert("blog: ".concat(Texts))
                    alert("blog: ".concat(showProps(Texts, "Texts")))
                    alert("blog: ".concat(showProps(Texts[0], "Texts[0]")))
                    // alert("Text[0]: ".concat(`${Texts[0]}`))
                    this.updateTexts(Texts)
                // })
            })
        }
    }

    this.init = function() {
    // inspiration: this.init = function(){
        document.getElementById(this.id_button).addEventListener("click", function(){
            app.blog()
          });
    }

    this.get = function(url) {
    // inspiration: this.get = function(url){
        alert("get")
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
}

function showProps(obj, objName) {
    var result = ``;
    for (var i in obj) {
      // obj.hasOwnProperty() is used to filter out properties from the object's prototype chain
      if (obj.hasOwnProperty(i)) {
        result += `${objName}.${i} = ${obj[i]}\n`;
      }
    }
    return result;
}

// alert("Gerador de Texto Online!")
var app
document.addEventListener("DOMContentLoaded", (evt)=>{
    app = new App()
    app.init()
})