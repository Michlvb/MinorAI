from bs4 import BeautifulSoup
import requests

class SupermarktScanner:
    def __init__(self):
        self.website = 'https://supermarktscanner.nl'

    def get_soup(self, product):
        source = requests.get(f'{self.website}/product.php?keyword={product}').text
        self.soup = BeautifulSoup(source, 'lxml')

    def get_supermarket_name(self, item):
        supermarket_info = item.find('span', class_='shoplogo')
        return supermarket_info.find('img')['alt'].replace('logo', '')

    def get_product_link(self, item):
        link_div = item.find('div', class_='cbp-pgitem-flip')
        print(link_div)
        link_reffed = link_div.find('a')['href']
        return "".join(link_reffed.split('p=')[-1].split())

    def get_product_kg_price(self, item):
        kg_price = item.find('h6', class_='pgkgprice')
        return kg_price.find('strong').text.split(' ')[-1]

    def search(self, product):
        self.get_soup(product)
        item = self.soup.find('li', class_='product-entry')
        if not item:
            return None
        supermarket_name = self.get_supermarket_name(item)
        product_link = self.get_product_link(item)
        product_kg_price = self.get_product_kg_price(item)
        return {
            'product': product,
            'supermarket': supermarket_name,
            'link': product_link,
            'kg_price': product_kg_price
        }

s = SupermarktScanner()
r = s.search('appels')
print(r)