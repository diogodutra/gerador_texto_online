from flask import Flask, jsonify, render_template, request

from .planet_tracker import PlanetTracker

__all__ = ["app"]

tracker = PlanetTracker()

# the following coordinates are for the Greenwich Observatory in the UK
tracker.lon = "-0.0005"
tracker.lat = "51.4769"
tracker.elevation = 0.0

app = Flask(__name__, static_url_path="",
            static_folder="./../client",
            template_folder="./../client")


@app.route("/geo_location", methods=["POST"])
def geo_location():
    print("get_location")
    data = request.form
    parsed_data = {
        "lon": str(data["lon"]),
        "lat": str(data["lat"]),
        "elevation": float(data["elevation"])
    }

    tracker.lon = parsed_data["lon"]
    tracker.lat = parsed_data["lat"]
    tracker.elevation = parsed_data["elevation"]
    # print(tracker.lon, tracker.lat, tracker.elevation)
    return jsonify(parsed_data)


@app.route("/planets/<planet_name>", methods=["GET"])
def get_planet_ephmeris(planet_name):
    print(f"get_planet_ephmeris: {planet_name}")
    planet_data = tracker.calc_planet(planet_name)
    return jsonify(planet_data)


@app.route('/')
def hello():
    return render_template("index.html")
    # return web.FileResponse("./client/index.html")
