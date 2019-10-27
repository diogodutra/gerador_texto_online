import urllib
from bs4 import BeautifulSoup
import requests

import asyncio
import aiohttp

    
async def make_request(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            # if resp.status == 200:
            #     print(await resp.text())
                
            text = await resp.text()

    return str(text)


class Googler():
    urls = []
    titles = []
    descriptions = []
    soups = []


    def get_soup(self, search='hello world', max_results=10,
         *, country=None, language=None):

        self.soups = []

        text = urllib.parse.quote_plus(search)
        google_url = 'https://google.com/search?q=' + text
        
        if country is not None:
            google_url += '&cr=country' + country
        if language is not None:
            google_url += '&lr=lang_' + language
            
        # url_header = '/url?q='
        # ignore_links_with_substrings = ['google.com']
        # domains = []
        
        max_pages = max_results // 10
        for result_page in range(max_pages):
            #BUG: deal error when Google has less results than max_results
            #BUG: deal error when Google blocks robots
            google_url_pageN = google_url + '&start=' + str(result_page+1)

            # response = requests.get(google_url_pageN)

            # # #with open('output.html', 'wb') as f:
            # # #    f.write(response.content)
            # # #webbrowser.open('output.html')

            # self.soups.append(BeautifulSoup(response.text, "lxml"))
            
            loop = asyncio.get_event_loop()
            loop.run_until_complete(text = make_request(google_url_pageN))
            # text = self.make_request(google_url_pageN)
            self.soups.append(BeautifulSoup(text, "lxml"))
                
        return self.soups


    def get_metadata(self):      
        self.urls = []
        self.titles = []
        self.descriptions = []

        for soup in self.soups:
            item = soup.html.body
            # item = soup.find(id='main')

            if item is not None:
                results = list(item.children)
                for result in results[3:]:
                    try:
                        title = result.div.div.a.div.string
                        title = title.split(' -')[0].split(' |')[0]
                        self.titles.append(title)
                        
                        self.urls.append(result.div.div.a.get('href').split('/url?q=')[1].split('&sa=')[0])
                        
                        item = result.div.div.find_next_sibling().find_next_sibling().div.div.div.div.div
                        self.descriptions.append(list(item.children)[-1])
                    
                    except:
                        #not a valid result item
                        self.descriptions.append('')
                        pass
                
        return self.urls, self.titles, self.descriptions


    def google(self, search='hello world', max_results=10, *, country=None, language=None):
        self.get_soup(search, max_results=max_results, language=language, country=country)
        urls, titles, descriptions = self.get_metadata()
        return urls, titles, descriptions


    '''
    if __name__=="__main__":
        "Example of usage."

        keywords = '"chá de bebê" lista presentes'
        country = 'BR'

        #avoid Googling too often, otherwise your IP will be blocked
        force_google = True

        if 'soups' not in locals() or force_google:
            urls, titles, paragraphs, soups = google(keywords, country=country)

        n=9
        for url, title, paragraph in zip(urls[:n], titles[:n], paragraphs[:n]):
            print(url)
            print(title)
            print(paragraph)
            print()
    '''