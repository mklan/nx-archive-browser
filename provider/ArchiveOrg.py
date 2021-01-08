from urllib.request import urlopen
from bs4 import BeautifulSoup

base_url = "http://archive.org/download/"

cache = {}


def fetch(collection):
    if collection in cache:
        return cache[collection]

    url = base_url+collection

    html = urlopen(url).read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")
    rows = soup.find_all("tr")

    list = []

    for row in rows[1:]:
        cells = row.find_all("td")
        src = cells[0].find_all("a")[0]

        title = src.get_text()
        link = url + '/' + src['href']
        size = cells[2].get_text()

        list.append({'title': title, 'size': size, 'link': link})

    cache[collection] = list
    return list
