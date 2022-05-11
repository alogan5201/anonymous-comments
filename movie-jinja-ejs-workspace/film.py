"""
Ref: https://jinja.palletsprojects.com/en/3.0.x/

Ref: https://www.youtube.com/watch?v=q9na89PgzGk
Ref: https://www.youtube.com/watch?v=9v6kDoUjIs4
"""

from jinja2 import Environment, FileSystemLoader
import json
from slugify import slugify
import os
jsonFiles = [
"output/movies/json/misc/filmlocations0-18.json",
"output/movies/json/misc/filmlocations18-36.json",
"output/movies/json/misc/filmlocations36-54.json",
"output/movies/json/misc/filmlocations54-72.json",
"output/movies/json/misc/filmlocations72-90.json",
"output/movies/json/misc/filmlocations90-108.json",
"output/movies/json/misc/filmlocations108-126.json",
"output/movies/json/misc/filmlocations126-144.json",
"output/movies/json/misc/filmlocations144-162.json",
"output/movies/json/misc/filmlocations162-180.json",
"output/movies/json/misc/filmlocations180-198.json",
"output/movies/json/misc/filmlocations198-216.json",
"output/movies/json/misc/filmlocations216-234.json",
"output/movies/json/misc/filmlocations234-249.json"]


def openJson(file):
    with open(file, "r") as f:
        result = json.load(f)['result']
    return result
    
def paginationSet():
    
    with open('./pagination.json', "r") as f:
        result = json.load(f)
        
    return result
    
def getPagItem(i):
    payload = []
    with open('./pagination.json', "r") as f:
        result = json.load(f)
        payload.append(payload)
    return result
headings = ["title", "plot", "image", 'locations' ]

fileloader = FileSystemLoader("templates")
env = Environment(loader=fileloader)


def renderDirectory( data, page ):
    
    link = "../geo-front-end/src/views/pages/movie-locations/"+page+"/index.ejs"
    with open (link, "w") as fout:
        fout.write(data)
 
def createDirectoryPages():
    count = 0
    pagination = [paginationSet()]
    ps = pagination[0]
    for index, file in enumerate(jsonFiles, start=0):         
        set = [ps[index]]
        films = openJson(file)
        directoryPage = index +1
        page = str(directoryPage)
             
        # /home/a/Desktop/geo-front-end/src/views/pages/movie-locations
        os.mkdir("../geo-front-end/src/views/pages/movie-locations/"+page)  
        data = env.get_template("t-film-directory-ejs.html").render(films=films, title= "fixed addresses NU Infoblox", headings=headings, set=set)
        #renderDirectory(data,page)



createDirectoryPages()


