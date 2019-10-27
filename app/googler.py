import urllib
from bs4 import BeautifulSoup
import requests
# import webbrowser


def google_soup(search='hello world', max_results=10, *, country=None, language=None):
    text = urllib.parse.quote_plus(search)
    google_url = 'https://google.com/search?q=' + text
    
    if country is not None:
        google_url += '&cr=country' + country
    if language is not None:
        google_url += '&lr=lang_' + language
        
    url_header = '/url?q='
    urls = []
    ignore_links_with_substrings = ['google.com']
    domains = []
    soups = []
    
    max_pages = max_results // 10
    for result_page in range(max_pages):
        #BUG: deal error when Google has less results than max_results
        #BUG: deal error when Google blocks robots
        google_url_pageN = google_url + '&start=' + str(result_page+1)

        response = requests.get(google_url_pageN)

        #with open('output.html', 'wb') as f:
        #    f.write(response.content)
        #webbrowser.open('output.html')

        soups.append(BeautifulSoup(response.text, "lxml"))
            
    return soups


def extract_soups(soups):
    urls = []
    titles = []
    paragraphs = []
    
    for soup in soups:
        item = soup.html.body
        item = soup.find(id='main')

        results = list(item.children)
        for result in results[3:]:
            try:
                title = result.div.div.a.div.string
                title = title.split(' -')[0].split(' |')[0]
                titles.append(title)
                
                urls.append(result.div.div.a.get('href').split('/url?q=')[1].split('&sa=')[0])
                
                item = result.div.div.find_next_sibling().find_next_sibling().div.div.div.div.div
                paragraphs.append(list(item.children)[-1])
            
            except:
                #not a result item
                paragraphs.append('')
                pass
            
    return urls, titles, paragraphs


def google(search='hello world', max_results=10, *, country=None, language=None):
    soups = google_soup(search, max_results=max_results, language=language, country=country)
    urls, titles, paragraphs = extract_soups(soups)

    return urls, titles, paragraphs, soups


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