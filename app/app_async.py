from aiohttp import web
import asyncio

from .planet_tracker import PlanetTracker

from .googler import Googler
from .scrapper import Scrapper
from .spinner import Spinner

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
    

@routes.get("/spinner/{text}")
async def spin(request):
    text = request.match_info['text']
    lang='pt'
    spinner = Spinner()
    spinned_text = spinner.spin(text, lang)
    json = {'text': text, 'spin': spinned_text}

    return web.json_response(json)
    

# BUG: ?
@routes.get("/scrapper/{url}")
async def scrap(request):
    url = request.match_info['url']
    scrapper = Scrapper()
    scrapper.scrap(url)
    json = {'url': url, 'text': scrapper.text}    
    return web.json_response(json)
    

@routes.get("/googler/{keywords}")
async def web_search(request):
    keywords = request.match_info['keywords']
    country = 'br'
    googler = Googler()
    googler.google(keywords, country=country)
    json = {}
    for i in range(len(googler.urls)):
        json[i] = {
                'url': googler.urls[i],
                'title': googler.titles[i],
                'description': googler.descriptions[i]
                }

    return web.json_response(json)

async def scrapper_spinner(url, lang='pt'):

    scrapper = Scrapper()
    text = scrapper.scrap(url)

    spinner = Spinner()
    text = spinner.spin(text, lang)

    return text
    

@routes.get("/blogger/{keywords}")
async def blogger(request):

    keywords = request.match_info['keywords']

    country = 'br'

    googler = Googler()
    googler.google(keywords, country=country)
    
    tasks = [scrapper_spinner(url) for url in googler.urls]
    await asyncio.gather(*tasks)

    json = {}
    # for i in range(len(googler.urls)):
    for i in range(len(tasks)):
        json[i] = {
                'url': googler.urls[i],
                'title': googler.titles[i]
                # 'text': tasks[i].result()
                }

    return web.json_response(json)


app = web.Application()
app.add_routes(routes)
app.router.add_static("/", "./client")
