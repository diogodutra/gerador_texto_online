from aiohttp import web

from .planet_tracker import PlanetTracker

__all__ = ["app"]

tracker = PlanetTracker()
# the following coordinates are for the Greenwich Observatory in the UK
tracker.lon = -0.0005
tracker.lat = 51.4769
tracker.elevation = 0.0

routes = web.RouteTableDef()


@routes.post("/geo_location")
async def geo_location(request):
    print("get_location")
    data = await request.post()
    # print(data)
    tracker.lon = str(data["lon"])
    tracker.lat = str(data["lat"])
    tracker.elevation = float(data["elevation"])
    # print(tracker.lon, tracker.lat, tracker.elevation)
    return web.json_response({"success": True})


@routes.get("/planets/{name}")
async def get_planet_ephmeris(request):
    planet_name = request.match_info['name']
    print(f"get_planet_ephmeris: {planet_name}")
    planet_data = tracker.calc_planet(planet_name)
    return web.json_response(planet_data)


@routes.get('/')
async def hello(request):
    return web.FileResponse("./index.html")


app = web.Application()
app.add_routes(routes)
app.router.add_static("/", "./")
