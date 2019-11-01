var App = function(){    

    this.id_text = "text"
    this.id_keywords = "keywords"
    this.id_button = "button"
    this.id_title = "title"
    this.id_text = "text"
    this.id_app = "app"
    this.id_results = "results"
    this.id_country = "country"
    this.id_language = "language"

    this.getTexts = function(keywords, country, language) {
    // inspiration: this.getPlanetEphemeris = function(planetName){
        // alert("getTexts: ".concat(keywords))
        var url = `/blogger/country=${country}&lang=${language}&keywords=${keywords}`
        // return this.get(`/blogger/${keywords}`).then((req) => {
        return this.get(url).then((req) => {
            return JSON.parse(req.response)
        })
    }

    this.removeTexts = function() {        
        // remove all the previous results
        var div_base = document.getElementById("results")
        while (div_base.firstChild) {
            div_base.removeChild(div_base.firstChild);
        }
    }

    this.updateTexts = function(Texts) {
        // inspiration: this.updatePlanetDisplay = function(planetData){
        // alert("updateTexts.length: ".concat(showProps(Texts.keys.length, "Texts.length")))
        var div_base = document.getElementById(this.id_results)
        for (var idx in Texts) {
            // alert("for: ".concat(showProps(Texts[idx], "Texts")))

            // create DOM for one text
            var new_div = document.createElement("div")
            var new_title = document.createElement("h1")
            var new_text = document.createElement("p")

            new_div.appendChild(new_title)
            new_div.appendChild(new_text)
            div_base.appendChild(new_div)
            
            new_div.setAttribute("id", "div_".concat(idx))
            new_title.setAttribute("id", "title_".concat(idx))
            new_text.setAttribute("id", "text_".concat(idx))

            // fill new DOM with content
            new_title.innerHTML = Texts[idx].title
            new_text.innerHTML = Texts[idx].text
        }
    }

    this.blog = function() {
    // inspiration: this.update = function(){
        app.removeTexts()
        var keywords = document.getElementById(this.id_keywords).value
        var country = document.getElementById(this.id_country).value
        var language = document.getElementById(this.id_language).value
        keywords = encodeURI(keywords)
        if (keywords) {
            // this.getTexts(keywords).then((Texts) => {
            this.getTexts(keywords, country, language).then((Texts) => {
                this.updateTexts(Texts)
            })
        }
    }

    this.init = function() {
    // inspiration: this.init = function(){

        // button click
        document.getElementById(this.id_button).addEventListener("click", function(){
            app.blog()
          });

        // key enter        
        document.getElementById(app.id_keywords).addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {

                // Cancel the default action, if needed
                // event.preventDefault();

                // Trigger the button element with a click
                document.getElementById(app.id_button).click();
            }
        });
    }

    this.get = function(url) {
    // inspiration: this.get = function(url){
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
      // obj.hasOwnProperty() is used to filter out properties
      // from the object's prototype chain
      if (obj.hasOwnProperty(i)) {
        result += `${objName}.${i} = ${obj[i]}\n`;
      }
    }
    return result;
}
  
function createText(Texts) {
    var div_base = document.getElementById("results")
    Texts.forEach((t, idx)=>{
        var new_div = document.createElement("div")
        var new_title = document.createElement("h1")
        var new_text = document.createElement("p")

        new_title.innerHTML = t.title
        new_text.innerHTML = t.text

        new_div.appendChild(new_title)
        new_div.appendChild(new_text)
        div_base.appendChild(new_div)
        
        new_div.setAttribute("id", "div_".concat(idx))
        new_div.setAttribute("id", "title_".concat(idx))
        new_div.setAttribute("id", "text_".concat(idx))

        new_div.setAttribute("class", "img-bg")
    })
}

// alert("Gerador de Texto Online!")
var app
document.addEventListener("DOMContentLoaded", (evt)=>{
    app = new App()
    app.init()
})

var Texts = []
Texts[0] = []
Texts[1] = []
Texts[2] = []
Texts[0].title = "Title0"
Texts[1].title = "Title1"
Texts[2].title = "Title2"
Texts[0].text = "Text0"
Texts[1].text = "Text1"
Texts[2].text = "Text2"

createText(Texts)

// alert("Texts.length: ".concat(Texts.length))