import urllib
from bs4 import BeautifulSoup
import requests

import asyncio
import aiohttp


class Googler():
    urls = []
    titles = []
    descriptions = []
    soups = []
    text = ''
    blacklist = ['youtube', 'facebook', 'twitter']


    def get_soup(self, search='hello world',
         *, country=None, language=None, max_results=10):

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

            response = requests.get(google_url_pageN)
            self.soups.append(BeautifulSoup(response.text, "lxml"))
                
        return self.soups


    def get_metadata(self):      
        self.urls = []
        self.titles = []
        self.descriptions = []

        for soup in self.soups:
            item = soup.html.body
            item = soup.find(id='main')

            if item is not None:
                results = list(item.children)
                for result in results[3:]:
                    try:
                        url = result.div.div.a.get('href').split('/url?q=')[1].split('&sa=')[0]
                        if any([substring in url for substring in self.blacklist]):
                            # ignore this result
                            pass

                        else:
                            self.urls.append()
                            
                            title = result.div.div.a.div.string
                            title = title.split(' -')[0].split(' |')[0]
                            self.titles.append(title)
                            
                            item = result.div.div.find_next_sibling().find_next_sibling().div.div.div.div.div
                            self.descriptions.append(list(item.children)[-1])
                    
                    except:
                        #not a valid result item
                        # self.descriptions.append('')
                        pass
                
        return self.urls, self.titles, self.descriptions


    def google(self, search='hello world', *, country=None, language=None, max_results=10):
        self.get_soup(search, language=language, country=country, max_results=max_results)
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