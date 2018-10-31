from flask import Flask, jsonify, render_template, request

from .planet_tracker import PlanetTracker

__all__ = ["app"]

app = Flask(__name__, static_url_path="",
            static_folder="./../client",
            template_folder="./../client")


@app.route("/planets/<planet_name>", methods=["GET"])
def get_planet_ephmeris(planet_name):
    data = request.args
    try:
        geo_location_data = {
            "lon": str(data["lon"]),
            "lat": str(data["lat"]),
            "elevation": float(data["elevation"])
        }
    except KeyError as err:
        # default to Greenwich observatory
        geo_location_data = {
            "lon": "-0.0005",
            "lat": "51.4769",
            "elevation": 0.0,
        }
    print(f"get_planet_ephmeris: {planet_name}, {geo_location_data}")
    tracker = PlanetTracker()
    tracker.lon = geo_location_data["lon"]
    tracker.lat = geo_location_data["lat"]
    tracker.elevation = geo_location_data["elevation"]
    planet_data = tracker.calc_planet(planet_name)
    return jsonify(planet_data)


@app.route('/')
def hello():
    return render_template("index.html")
    # return web.FileResponse("./client/index.html")
