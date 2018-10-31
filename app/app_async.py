from aiohttp import web

from .planet_tracker import PlanetTracker

__all__ = ["app"]

routes = web.RouteTableDef()


@routes.get("/planets/{name}")
async def get_planet_ephmeris(request):
    planet_name = request.match_info['name']
    data = request.query
    try:
        geo_location_data = {
            "lon": str(data["lon"]),
            "lat": str(data["lat"]),
            "elevation": float(data["elevation"])
        }
    except KeyError as err:
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
    planet_data["geo_location"] = geo_location_data
    return web.json_response(planet_data)


@routes.get('/')
async def hello(request):
    return web.FileResponse("./client/index.html")


app = web.Application()
app.add_routes(routes)
app.router.add_static("/", "./client")
