"""
Ref: https://jinja.palletsprojects.com/en/3.0.x/

Ref: https://www.youtube.com/watch?v=q9na89PgzGk
Ref: https://www.youtube.com/watch?v=9v6kDoUjIs4
"""
import re
import nltk
from nltk.tokenize import TweetTokenizer, sent_tokenize
import os
from venv import create
from jinja2 import Environment, FileSystemLoader
import json
from slugify import slugify
from mapbox import Geocoder
import geojson
import numpy as np
from haversine import haversine, Unit, haversine_vector
from icecream import ic
MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA"
geocoder = Geocoder(access_token=MAPBOX_ACCESS_TOKEN)

#old /home/a/Desktop/python-test-project/output/movies/json/misc/filmlocations0-249.json
newgeojsonPath = '/home/a/allfilms250.json'
with open(newgeojsonPath, "r") as fin:
    data = json.load(fin)

films = data['films']
    


headings = ["title", "plot", "image", 'locations' ]

fileloader = FileSystemLoader("templates")
env = Environment(loader=fileloader)


def renderDetailsPage( data,  slug):
    # data is str
    
    with open (slug, "w") as fout:
        fout.write(data)
    
    
def renderFiles():
    startingSet=[0,18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    finishedSet=[18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    testStart = [0,2]
    testEnd = [2, 4]
    i = 0
 
    while (i < len(finishedSet)):
        print(i)
        
        scrapeLocationData(startingSet[i], finishedSet[i])
        
        i += 1

def extractCoords(data):
  result = []
  for d in data:
    features = d['features']
 
    for f in features:
      center = f['center']
    
      obj = {"name": f['place_name'], "lat": center[1], "lon": center[0]}
      result.append(obj)
  return result  

def getCoords(x):
  result = []
  for d in x:
    features = d['features']
 
    for f in features:
      center = f['center']
   
      
      result.append(center)
  return result  


  
def a(coords):
    i = 0
    result = []
    while i < len(coords):
        itra = i +1
        #print(itra,'coords = ', coords[i])
        last = len(coords)
        l = last - 2
        if i >= l:
            print('no data for coords', coords[i])
            break
        else:      
            a = i +1
            b = i + 2
            x = haversine_vector([coords[i], coords[i]], [coords[a], coords[b]], Unit.KILOMETERS)
            radius = 500
            f = x[0]
            j = x[1]
            itr = i + 1
            itr2 = i +2
            itr3 = i + 3
            #print('distance from', itr, 'to',itr2,'is', f, 'km')
            #print('distance from', itr, 'to',itr3,'is', j, 'km')
            radius = 100
            
            
            if j < radius and f < radius:
                coords[i].reverse()
                coords[a].reverse()
                coords[b].reverse()
                box = [coords[i], coords[a], coords[b]]
                return box
                break
            i += 1
    

def createDetailPages():
    startingSet=[0,18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    finishedSet=[18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    testStart = [0,2]
    testEnd = [2, 4]
    i = 0
    
    while (i < len(films)):
        print(i)
        #print(films[i])
        
        #renderDetailsPage()
        slug = str(films[i].get('slug'))
        p = i +1
        page = str(p)
        filmItem = films[i]
        v = list(films[i].values())
        k = list(films[i].keys())
        id = v[0]
        image=v[1]
        index=v[2]
        locations = v[3]
        plot = films[i]['plot'][0]
        slug = v[5]
        title = v[6]
        film_details = [{"index":index, "id": id, "slug": slug, "title": title,"plot": plot, "image": image }]
        #print(film_details)
        data = env.get_template("t-film-details.html").render(film_details=film_details, locations=locations, title= "fixed addresses NU Infoblox", headings=headings)
        link = "/home/a/Desktop/python-test-project/workspace/test/"+slug+ ".html"
        renderDetailsPage(data, link)
        


def createDirectories():  
  for index, film in enumerate(films, start=0):
        print(index)
        slug = str(film.get('slug'))
        p = index +1
        page = str(p)
        filmItem = film
        v = list(film.values())
        k = list(film.keys())
        id = v[0]
        image=v[1]
        index=v[2]
        locations = v[3]
        plot = film['plot'][0]
        slug = v[5]
        title = v[6]
        film_details = [{"index":index, "id": id, "slug": slug, "title": title,"plot": plot, "image": image }]
        print(slug)
        data = env.get_template("t-film-details-ejs.html").render(film_details=film_details, locations=locations, title= "fixed addresses NU Infoblox", headings=headings)
        link = "/home/a/Desktop/python-test-project/workspace/test/"+slug+ ".html"
        #/home/a/Desktop/t/geo-front-end/src/views/pages/movie-locations
        dir = os.path.join('/home/', 'a/Desktop/t/geo-front-end/src/views/pages/movie-locations/'+slug)
        if not os.path.exists(dir):
          os.mkdir(dir)

def convert(lst):
      
    return (lst[0].split())
 
# Driver code


def splitPlot(list):
    result = []
   
    if len(list) > 750:
        
        first = list[0:750]
        
        length = len(list)
        last = list[750:length]
        
        obj = {
        "plot": first+"...",
        "metaplot": last
        }
        result.append(obj)
     
        return result
    else:
        
        obj = {
        "plot": list,
        "metaplot": []
        }
        result.append(obj)
    return result
def removeCharacters(string):
    first = string.replace("::", " ")
    second = first.replace("\"", " ")
    modified_string = re.sub(r"\<[^()]*\>", "", second)
    return modified_string
def removeQuotes(t):
      result = []
      for x in t:
            x.replace("'", "")
      
def extractLocation(q):
    parsed = removeCharacters(q)
    result = parsed.split("(",1)[0] 
    return result

def getCoordinates(query): 
    arr = []
    response = geocoder.forward(query, limit=1)
    collection = response.json()
    if response.status_code == 200:
        first = response.geojson()['features'][0]
        arr.append(first)
        
        #with open ('./location-test.json', "w") as fout:
            #fout.write(json.dumps(first, sort_keys=True, indent=4))
    else:
        arr.append("")
    return arr

def new():
    locationData = []
    for index, item in enumerate(films[1:2], start=0):
            locations= item['locations']
            
            print(index)
            
            
            #locationData.append(len(locations))
            for l in locations:
                parsed = extractLocation(l)
                locationWithDetails = removeCharacters(l)
                data = getCoordinates(parsed)
                locationData.append(data)
                
                   
    return locationData


def geoDataCheck(locationData, coords):
   
      if len(coords) < 3:    
        
        geodata = [{'data': locationData, 'bbox': None}]
        return geodata
      else:
            ordered = sorted(coords , key=lambda k: [k[1], k[0]])
            box = a(ordered)
            geodata = [{'data': locationData, 'bbox': box}]    
            return geodata

def details():
    for index, film in enumerate(films, start=0):
        
        slug = str(film.get('slug'))
        p = index +1
        v = list(film.values())
        k = list(film.keys())
        id = v[0]
        image=v[1]
        index=v[2]
        locations = v[3]
        plot = v[4]
        slug = v[5]
        title = v[6]
        pplot = removeCharacters(plot)
        splitted = splitPlot(pplot)
        newplot = splitted[0]['plot']
        metaplot = splitted[0]['metaplot']
        #ic(len(newplot), newplot, len(metaplot), metaplot)
        film_details = [{"index":index, "id": id, "slug": slug, "title": title,"plot": newplot,"metaplot": metaplot, "image": image }]
        
        if len(locations)<= 1:
          print('NO LOCATION DATA')
          continue
        else:
          locationData  = extractCoords(locations)
          coords = getCoords(locations)

          dir = os.path.join('/home/', 'a/Desktop/geotools/geo-front-end/geo-front-end/src/views/pages/movie-locations/'+slug)
          if not os.path.exists(dir):
              os.mkdir(dir)   
              
          link = "/home/a/Desktop/geotools/geo-front-end/geo-front-end/src/views/pages/movie-locations/"+slug+"/index.ejs" 
          
        
          geodata = geoDataCheck(locationData, coords)
          data = env.get_template("t-film-details-ejs.html").render(film_details=film_details, locations=locations,geodata=geodata, title= "fixed addresses NU Infoblox", headings=headings)
         
          renderDetailsPage(data, link)
        


      
details()


def writeData():
    data = new()
    with open ('./location-data.json', "w") as fout:
            fout.write(json.dumps(data, sort_keys=True, indent=4))




