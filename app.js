var App = function(){
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

    this.postGeoLocation = function(){
        var processCoordinates = (position)=>{
            var postUrl = [
                `lon=${position.coords.longitude}`,
                `lat=${position.coords.latitude}`,
                `elevation=${position.coords.altitude}`
            ]
            return postUrl
        }
        return this.getGeoLocation().then(
            (position)=>{
                var postUrl = processCoordinates(position)
                return app.post("/geo_location", postUrl.join("&"))
            }
        )
    }

}


var app = new App()
app.postGeoLocation()
