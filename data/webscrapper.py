#!/usr/bin/env python3
"""
Author : taniya <https://github.com/tas09009>
Date   : 2020-10-12
Purpose: Thredup scrape
"""

import requests
import time
import random
from bs4 import BeautifulSoup
import pandas as pd
from alive_progress import alive_bar

# --------------------------------------------------
""" Define inputs """

url1 = input("url link: ")
pages = int(input("# of pages to scrape - 5 minutes/page: "))
file_name = input("name of file to save as - located in data folder: ")


# --------------------------------------------------
def main():
    """
    Input:
    - url: searched items

    Output:
    - hrefs: links of all products on all pages (50 links/page)
    - soupified_list: beautiful soup object (parsed html) of each link within hrefs
    """

    url = url1 + "&page="
    
    product_list = []
    # Everytime range increases, items increase by 50.
    for page_number in range(1, pages + 1):
        url_page = (url) + str(page_number)
        # Parse HTML and pull all href links
        response = requests.get(url_page)
        main_page_items = BeautifulSoup(response.text, "html.parser")

        hrefs = []
        product_list = []
        grid_products = main_page_items.findAll(
            "div", {"class": "_1xHGtK _373qXS"}
        )
        for i in grid_products:
            product = i.find("a", {"class": "_2UzuFa"}).get("href")
            product_list.append(product)
        url_front = "https://www.flipkart.com"
        for a in product_list:
            hrefs.append(url_front + a)

        # Lists to store scraped data for each of the 50 items per page
        name = []
        image = []
        measurements = []
        price = []
        brand = []
        color = []
        fabric = []
        sleeve = []
        suitability = []
        closure = []
        pocketType = []


        with alive_bar(len(hrefs)) as bar:
            for link in hrefs:
                
                response = requests.get(link)
                product_page_soupified = BeautifulSoup(response.text, "html.parser")
                

                # name find

                name_search = product_page_soupified.find("h1" , {"class" : "yhB1nd"})
                if name_search:
                    name_find = name_search.find("span", {"class" : "B_NuCI"}).getText()
                    name.append(name_find)
                else:
                    name.append(None)


                # image find

                image_search = product_page_soupified.findAll(
                    "div", {"class": "_312yBx SFzpgZ"}
                )
                if(len(image_search)==0):
                    image.append(None)
                for i in image_search:
                    product = i.find("img", {"class": "_2r_T1I"}).get("src")
                    image.append(product)
                    break
                

                #details find

                details_search = product_page_soupified.find(
                    "div" , {"class" : "X3BRps"}
                )
                detail_object = {
                    "Closure" : None,
                    "Fabric" : None,
                    "Sleeve" : None,
                    "Suitable For" : None,
                    "Color" : None,
                    "Pocket Type" : None
                }
                if details_search : 
                    details_rows = details_search.findAll(
                        "div" , {"class" : "row"}
                    )
                    for i in details_rows:
                        key = i.find("div" , {"class" : "_2H87wv"}).getText()
                        val = i.find("div" , {"class" : "_2vZqPX"}).getText()
                        if(key in detail_object.keys()):
                            detail_object[key] = val
                
                closure.append(detail_object["Closure"])
                pocketType.append(detail_object["Pocket Type"])
                color.append(detail_object["Color"])
                suitability.append(detail_object["Suitable For"])
                fabric.append(detail_object["Fabric"])
                sleeve.append(detail_object["Sleeve"])


                # measurement find

                product_item_measurement_size = []
                measurement_size_search = product_page_soupified.findAll(
                    "ul", {"class": "_1q8vHb"}
                )
                for i in measurement_size_search:
                    product = i.findAll("a" ,{"class" : "_1fGeJ5"})
                    measurement =[] 
                    for y in product:
                        measurement_size = y.getText()
                        measurement.append(measurement_size)
                    if(len(measurement)):
                        product_item_measurement_size.append(measurement)

                measurements.append(product_item_measurement_size)


                # price search

                price_search = product_page_soupified.findAll(
                    "div", {"class": "_25b18c"}
                )
                if(len(price_search)==0):
                    price.append(10000)
                for i in price_search:
                    product_price = i.find(
                        "div", {"class": "_30jeq3"}
                    ).getText()
                    ans = ""
                    for c in product_price:
                        if c.isnumeric():
                            ans += c
                    price.append(float(ans))
                    break


                # brand search

                brand_search = product_page_soupified.findAll(
                    "h1", {"class": "yhB1nd"}
                )
                for i in brand_search:
                    product = i.find("span", {"class": "G6XhRU"}).getText()
                    brand.append(product)
                if(len(brand_search)==0):
                    brand.append(None)


                time.sleep(random.randrange(3, 4))
                bar()
            basic_scrape = pd.DataFrame(
                {
                    "Name" : name,
                    "Link": hrefs,
                    "Image_Link": image,
                    "Closure" : closure,
                    "Pocket Type" : pocketType,
                    "Fabric" : fabric,
                    "Suitable_For" : suitability,
                    "Sleeve" : sleeve,
                    "Color" : color,
                    "Measurements": measurements,
                    "Price": price,
                    "Brand": brand
                }
            )
            print(basic_scrape)
            basic_scrape.to_csv("data/" + file_name+".csv", index=False, header=True , mode='a')


# --------------------------------------------------
if __name__ == "__main__":
    main()
