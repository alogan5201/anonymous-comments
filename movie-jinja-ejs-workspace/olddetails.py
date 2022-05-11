"""
Ref: https://jinja.palletsprojects.com/en/3.0.x/

Ref: https://www.youtube.com/watch?v=q9na89PgzGk
Ref: https://www.youtube.com/watch?v=9v6kDoUjIs4
"""
from sklearn.neighbors import NearestNeighbors
import nltk


from math import radians, cos, sin, asin, sqrt
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
nltk.download('punkt')
MAPBOX_ACCESS_TOKEN="pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA"
geocoder = Geocoder(access_token=MAPBOX_ACCESS_TOKEN)

allFilmsPath = '/home/a/Desktop/python-test-project/output/movies/json/misc/filmlocations0-249.json'

newgeojsonPath = '/home/a/Desktop/geotools/geo-server/geotools/films-top250.json'


with open(newgeojsonPath, "r") as fin:
    films = json.load(fin)


    


headings = ["title", "plot", "image", 'locations']

fileloader = FileSystemLoader("templates")
env = Environment(loader=fileloader)


def renderDetailsPage( data,  slug):
  print('FILE CREATED', slug)
  with open (slug, "w") as fout:
      fout.write(data)
    
    
def renderFiles():
    startingSet=[0,18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    finishedSet=[18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    testStart = [0,2]
    testEnd = [2, 4]
    i = 0
 
    while (i < len(finishedSet)):
       
        
        scrapeLocationData(startingSet[i], finishedSet[i])
        
        i += 1

  

def createDetailPages():
    startingSet=[0,18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    finishedSet=[18,36,54,72,90,108,126,144,162,180,198,216,234,249]
    testStart = [0,2]
    testEnd = [2, 4]
    i = 0
    
    while (i < len(films)):
       
       
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

        data = env.get_template("t-film-details.html").render(film_details=film_details, locations=locations, title= "fixed addresses NU Infoblox", headings=headings)
        link = "/home/a/Desktop/python-test-project/workspace/test/"+slug+ ".html"
        renderDetailsPage(data, link)
        


def extractCoords(data):
  result = []
  for d in data:
    features = d['features']
 
    for f in features:
      center = f['center']
    
      obj = {"name": f['place_name'], "lat": center[1], "lon": center[0]}
      result.append(obj)
  return result  
    
  
filmsnew = films['results']

def get_ordered_list(points, x, y):
   points.sort(key = lambda p: (p.x - x)**2 + (p.y - y)**2)
   return points
def getCoords(x):
  result = []
  for d in x:
    features = d['features']
 
    for f in features:
      center = f['center']
   
      
      result.append(center)
  return result  

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r



def checkDistance(lon1, lat1, lon2, lat2):
  a1 = haversine(lon1, lat1, lon2, lat2)
  radius = 500.00
  if a1 <= radius:
        return True
  else: 
    return False
  
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
        
    #else: 
        #print(' no data for ', coords[i])
   
    #print(coords)
      
        



def splitPlot(list):
  result = []
  if len(list) > 3:
    
    firstThree = list[0:3]
    
    length = len(list)
    last = list[3:length]
    obj = {
      "plot": firstThree,
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



def newdetails():
    for index, film in enumerate(filmsnew, start=0):
       
        
        v = list(film.values())
        k = list(film.keys())
        id = v[0]
        image=v[1]
        itr=v[2]
        locations = v[3]
        p = v[4]
        slug = v[5]
        title = v[6]
        
        
        plotCheck = splitPlot(p)
        plot = plotCheck[0]['plot']
        metaplot = plotCheck[0]['metaplot']
        film_details = [{"index":index, "id": id, "slug": slug, "title": title,"plot": plot, "image": image }]
       
        if len(locations)<= 1:
          print('NO LOCATION DATA')
          continue
        else:
          #print('iteration', index)
          locationData  = extractCoords(locations)
          coords = getCoords(locations)
      
          if not os.path.exists("/home/a/Desktop/new-geo-front-end/geo-front-end/src/views/pages/movie-locations/"+slug):
              os.mkdir("/home/a/Desktop/new-geo-front-end/geo-front-end/src/views/pages/movie-locations/"+slug)
          
          
          if len(coords) < 3:
            #print('less than 3')
            geodata = [{'data': locationData, 'bbox': None}]
            data = env.get_template("t-film-details-ejs.html").render(film_details=film_details, geodata=geodata, metaplot= metaplot, title= "fixed addresses NU Infoblox", headings=headings)
            #/home/a/Documents/geo-front-end/src/views/pages/movie-locations
            link = "/home/a/Desktop/new-geo-front-end/geo-front-end/src/views/pages/movie-locations/"+slug+ "/index.ejs"
            renderDetailsPage(data, link)

          else:
            ordered = sorted(coords , key=lambda k: [k[1], k[0]])
  
            box = a(ordered)
           
            
            
            geodata = [{'data': locationData, 'bbox': box}]
            
            data = env.get_template("t-film-details-ejs.html").render(film_details=film_details, geodata=geodata,  metaplot= metaplot,  title= "fixed addresses NU Infoblox", headings=headings)
           
            link = "/home/a/Desktop/new-geo-front-end/geo-front-end/src/views/pages/movie-locations/"+slug+ "/index.ejs"
            renderDetailsPage(data, link)
        
newdetails()


def createDirectories():  
  for index, film in enumerate(films, start=0):
       
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
        #print(slug)
        data = env.get_template("t-film-details-ejs.html").render(film_details=film_details, locations=locations, title= "fixed addresses NU Infoblox", headings=headings)
        link = "/home/a/Desktop/python-test-project/workspace/test/"+slug+ ".html"
        #/home/a/Documents/geo-front-end/src/views/pages/movie-locations
        dir = os.path.join('/home/', 'a/Desktop/geotools/wk/'+slug)
        if not os.path.exists(dir):
          os.mkdir(dir)



def removeCharacters(string):
    first = string.replace("::", " ")
    second = first.replace("\"", " ")
    return second

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
            
            
            
            
            #locationData.append(len(locations))
            for l in locations:
                parsed = extractLocation(l)
                locationWithDetails = removeCharacters(l)
                data = getCoordinates(parsed)
                locationData.append(data)
                
                   
    return locationData

def writeData():
    data = new()
    with open ('./location-data.json', "w") as fout:
            fout.write(json.dumps(data, sort_keys=True, indent=4))




