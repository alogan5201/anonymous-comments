"""
Ref: https://jinja.palletsprojects.com/en/3.0.x/

Ref: https://www.youtube.com/watch?v=q9na89PgzGk
Ref: https://www.youtube.com/watch?v=9v6kDoUjIs4
"""

from email.utils import parsedate
from jinja2 import Environment, FileSystemLoader
import json
from slugify import slugify
import os
from mapbox import Geocoder
import geojson
from icecream import ic


MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA"
geocoder = Geocoder(access_token=MAPBOX_ACCESS_TOKEN)

newgeojsonPath = '/home/a/allfilms250.json'


with open(newgeojsonPath, "r") as fin:
    data = json.load(fin)

films = data['films']


headings = ["title", "plot", "image", 'locations' ]

fileloader = FileSystemLoader("templates")
env = Environment(loader=fileloader)

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







def removeCharacters(string):
    first = string.replace("::", " ")
    second = first.replace("\"", " ")
    return second

def extractLocation(q):
    
    parsed = removeCharacters(q)
    result = parsed.split("(",1)[0] 
    return result

def parseData(x, film):
    result = []
    
    
    if len(x) > 30:   
      # size desired
      k = 30
      n = len(x)
      for i in range(0, n - k ):
        film['location'] = x.pop()
    

              
    


        
def init():
    result = []
    for index, film in enumerate(films[0:1], start=0):
            it = "Itereation"
            print("Iteration:" , index )
            print(film)    
            result.append(film)
    return result
            #coords = getCoordinates(p)
            #print(index, coords[0])
            #updateLocations(films,file, p, coords)
            
                
            #print(coords)
            
            #dict1 = {idForMovie: data_set }
            
                
            #with open ('./location-test.json', "w") as fout:
                #fout.write(json.dumps(coords, sort_keys=True, indent=4))  
def location():
    locations = init()
    print(len(locations))          



    
#location()

def newdetails():
    for index, film in enumerate(films, start=0):
       
        
        v = list(film.values())
        k = list(film.keys())
        id = v[0]
        image=v[1]
        itr=v[2]
        locations = v[3]
        plot = v[4]
        slug = v[5]
        title = v[6]
        film_details = [{"index":index, "id": id, "slug": slug, "title": title,"plot": plot, "image": image }]
        print(slug)

def renderDirectory( data, link ):
    with open (link, "w") as fout:
        fout.write(data)
def getMovieData(m, iteration, pagination):
    for film in m:
        v = list(film.values())
        k = list(film.keys())
        slug = film.get('slug')
        id = v[0]
        index=v[2]
        ic(index, slug)
        page = str(iteration)
        title = "Movie Locations: " + page
        
        data = env.get_template("test-directory.html").render(film=film, title=title, headings=headings, pagination = pagination)
        dir = os.path.join('/home/', 'a/Desktop/geotools/geo-front-end/geo-front-end/src/views/pages/movie-locations/'+page)
        if not os.path.exists(dir):
            os.mkdir(dir)   
        link = "/home/a/Desktop/geotools/geo-front-end/geo-front-end/src/views/pages/movie-locations"+page+"/index.ejs"
        renderDirectory(data,link)
        
        
def paginationLoop():
    pagination = [paginationSet()]
    pag = pagination[0]
    for i, p in enumerate(pag, start=0): 
        iteration = i +1
        start = p.get('fromResult')
        end = p.get('toResult')
        ic(iteration, start, end )
        filmstart = start - 1
        filmend = end - 1
        filmiteration = films[filmstart:end]
        #ic(filmiteration)
        page = str(iteration)
        title = "Movie Locations: " + page
        ic(p)
        data = env.get_template("test-directory.html").render(filmData=filmiteration, title=title, headings=headings, pagination =p)
        dir = os.path.join('/home/', 'a/Desktop/geotools/geo-front-end/geo-front-end/src/views/pages/movie-locations/'+page)
        if not os.path.exists(dir):
            os.mkdir(dir)   
        link = "/home/a/Desktop/geotools/geo-front-end/geo-front-end/src/views/pages/movie-locations/"+page+"/index.ejs"
        renderDirectory(data,link)
        
        


paginationLoop()


def createDirectoryPages(filmiteration):
    count = 0
    
    for index, film in enumerate(film, start=0):  
        v = list(film.values())
        k = list(film.keys())
        id = v[0]
        slug = str(film.get('slug'))
        p = index +1
        id = v[0]
        image=v[1]
        index=v[2]
        locations = v[3]
        plot = film['plot'][0]
        slug = v[5]
        title = v[6]
        
        # TODO: Refactor pagination set for new json
        #print(film)
        directoryPage = index +1
        page = str(directoryPage)     
        #print(index)
        # /home/a/Desktop/geo-front-end/src/views/pages/movie-locations
        #os.mkdir("./coords-ejs/"+page)  
        #data = env.get_template("t-film-directory-ejs.html").render(films=films, title= "fixed #addresses NU Infoblox", headings=headings, set=set)
        #renderDirectory(data,page)

#createDirectoryPages()
        



