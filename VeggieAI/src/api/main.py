#conda install beautifulsoup4 lxml requests
import os
from flask import Flask, request
from scanner import SupermarktScanner

app = Flask(__name__)
scanner = SupermarktScanner()


@app.route('/cheapest-product')
def cheapest_product():
    product = request.args.get('product', '')
    cheapest_product_data = scanner.search(product)
    if cheapest_product_data:
        return {
            'status': 'success',
            'data': cheapest_product_data
        }
    return {
        'status': 'failed',
        'data': 'product not found'
    }
    
def main():
    return app
