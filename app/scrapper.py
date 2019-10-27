import requests
from bs4 import BeautifulSoup
import re
from difflib import SequenceMatcher
import asyncio
import aiohttp

class Scrapper():
    url = ''
    web_page = None
    html = None
    text = ''
    min_match_for_valid_paragraph = 0.2
    
    async def make_request(self, url, force_request=False):
        if url != self.url or force_request == True:
            self.url = url
            
        print(f"making request to {url}")
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                if resp.status == 200:
                    # print(await resp.text())
                    self.web_page = await resp.text()
    

    def request(self, url, force_request=False):
        if url != self.url or force_request == True:
            self.url = url
            self.web_page = requests.get(self.url)


    def get_html(self):
        if self.web_page is not None:
            if self.web_page.status_code == 200:
                soup = BeautifulSoup(self.web_page.text, "lxml")
                self.html = soup.html
            else:
                print(f'No valid response from {self.url}.')
        else:
            print('Call request() before this method.')


    def extract_text(self):
        
        self.get_html()

        if self.html is not None:
            self.text = ''
            paragraphs = []
            for descendant in self.html.body.descendants:
                try:
                    paragraph = descendant.string
                    n_sentences = paragraph.count('. ')
                    n_curls = paragraph.count('{')
                    n_colons = paragraph.count(':')
                    #print(n_curls)
                    n_paragraphs = paragraph.count('.</p>')
                    is_paragraph = (n_sentences > 1 or n_paragraphs > 0) \
                        and n_curls < 3 and n_colons < 3# or n_commas > 1
                except:
                    is_paragraph = False
                
                if is_paragraph:# and descendant.name == 'p':
                    is_repeated = any([SequenceMatcher(a=paragraph,b=x).ratio() >= \
                         self.min_match_for_valid_paragraph for x in paragraphs])
                    if not is_repeated:
                        paragraphs.append(paragraph)

            self.text = '\n'.join(paragraphs)      

            if len(self.text)==0:
                print(f'Text not found in {self.url}.')
            else:
                self.remove_sentences_with()
                self.remove_hashtags()
                self.remove_characters()

        return self.text


    def remove_hashtags(self):
        text_clean = []
        paragraphs = self.text.split('\n')
        for paragraph in paragraphs:
            paragraph_clean = []
            words = paragraph.split(' ')
            for word in words:
                try:
                    first_char = word[0]
                except:
                    first_char = ' '

                if first_char != '#':
                    paragraph_clean.append(word)
                    
            paragraph_clean = ' '.join(paragraph_clean)        
            text_clean.append(paragraph_clean)
            
        text_clean = '\n'.join(text_clean)
                
        self.text = ''.join(text_clean)


    def remove_sentences_with(self, blacklist = ['@']):
        sentence_delimiters = ['.', '!', '?']
        for delimiter in sentence_delimiters:
            text_clean = []        
            sentences = self.text.split(delimiter)
            for sentence in sentences:
                #print(sentence)
                if not any(s in sentence for s in blacklist):
                    text_clean.append(sentence)
                    
            self.text = delimiter.join(text_clean)


    def remove_characters(self, blacklist=['\t', '  ']):
        self.text = self.text.strip()        
        for forbidden in blacklist:
            while forbidden in self.text:
                self.text = self.text.replace(forbidden, '')


'''
if __name__=="__main__":
    "Example of usage."

    scrapper = Scrapper()
    url = 'https://ultimosegundo.ig.com.br/politica/2017-04-25/reforma-da-previdencia.html'
    scrapper.request(url)
    scrapper.extract_text()
    print(scrapper.text)
'''