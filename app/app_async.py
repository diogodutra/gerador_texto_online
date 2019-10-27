from aiohttp import web

from .planet_tracker import PlanetTracker

from .googler import google
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

#     text = 'A comissão especial que analisa a proposta de reforma da Previdência na Câmara dos Deputados inicia na tarde desta terça-feira (25) a discussão do relatório apresentado na semana passada pelo relator , deputado Arthur Maia (PPS-BA).\
# Depois de fechar acordo com parlamentares da oposição, que tentavam obstruir a sessão de leitura do parecer do relator, o presidente da comissão da reforma da Previdência , deputado Carlos Marun (PMDB-MS), designou que todas as reuniões desta semana sejam para discutir o relatório e apresentar pedido de vista.\
# O acordo com a oposição ainda definiu que a votação do relatório pelos membros da comissão deve ocorrer na próxima semana, dia 2 de maio. Já a partir do dia 8, o relatório estaria pronto para ser votado no plenário da Câmara dos Deputados. Para que isso aconteça, a equipe do governo Temer segue atuando para conquistar os votos necessários para aprovar as mudanças nas regras para a aposentadoria.\
# Para reduzir a resistência à proposta, o Planalto aceitou flexibilizar alguns pontos do texto original, embora a maior parte das ideias iniciais tenha sido preservada.\
# O relatório de Arthur Maia fixa a idade mínima de aposentadoria em 62 anos para as mulheres e em 65 anos para os homens após um período de transição de 20 anos. Ou seja, o aumento seria progressivo, começando em 53 e 55 anos, respectivamente, na data da promulgação da emenda.\
# Para a aposentadoria por tempo de contribuição, o segurado terá que calcular quanto falta para se aposentar pelas regras atuais – 35 anos para o homem e 30 anos para a mulher – e adicionar um pedágio de 30%.\
# Aí é só checar na tabela do aumento progressivo da idade, que começa em 53 anos para a mulher e 55 anos para o homem, e verificar qual idade mínima vai vigorar após este tempo. Pela tabela, a idade sobe um ano a cada dois anos a partir de 2020. Portanto, os 65 anos do homem só serão cobrados a partir de 2038.'

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
    # scrapper.request(url)
    scrapper.make_request(url)
    async with scrapper.extract_text() as scrapped_text:
        json = {'url': url, 'text': await scrapped_text}        
        return await web.json_response(json)
    

@routes.get("/googler/{keywords}")
async def web_search(request):
    keywords = request.match_info['keywords']
    country = 'br'
    urls, titles, paragraphs, _ = await google(keywords, country=country)
    json = {}
    for i in range(urls):
        json[i] = {'url': urls[i], 'title': titles[i], 'description': paragraphs[i]}

    return web.json_response(json)


app = web.Application()
app.add_routes(routes)
app.router.add_static("/", "./client")
