# Discover the region of Tübingen

1. The API requests location data around a given radius, and displays result on the map

2. The backend, selects all shops within radius from a user given location.

3. Front end, allows users to enter an adress, distance and choose shop category 


## Installation


### Prerequisites

What things you need to run the service on Windows

```
Python27
Flask
Sqlite with Spatialite (64bit)

```

### Installing

Install Python27 https://python-xy.github.io/downloads.html, set directories to system path:

```
C:\Python27
C:\Python27\Scripts
C:\Python27\DLLs

```
Download sptaialite http://www.gaia-gis.it/gaia-sins/windows-bin-amd64/
```
extrac files and save dll flies on C:\ drive 
set path to system variable
```
Download sptaialite-gui https://www.gaia-gis.it/spatialite-2.3/

```
simply download and run the spatialite-gui, it doesn't require any installation
```

Download sptaialite-shell "spatialite executable" here https://www.gaia-gis.it/spatialite-2.3/

```
save the spatialite shell in directory where database and dll files are
```

Install Flask:

```
virtualenv venv

mkdir myproject

cd myproject

virtualenv venv

venv\Scripts\activate

pip install Flask

set Flask_APP=api.py

set FLASK_DEBUG=1

flask run

```

## API Specification

Base Url: ```http://127.0.0.1:5000/```

Main collection: ```/adress```
				 ```/long_lat```
				 ```/draw```
				 
#### Give adress name

* URL: /adress

* Method: GET

* Request Parameters:

	- *adress:* charachter string
	
* Response:

	- *long lat*: charachter string
	
* Example:

- curl http://127.0.0.1:5000/adress?c=Marktplatz 1


#### Set distance around adress

* URL: /long_lat

* Method: POST

* Parameters:

	- *distanz:* integer
	- *cat:* charachter string
	
* Response:

	- *long lat*: charachter string

* Example:

- curl http://127.0.0.1:5000/long_lat?distanz=12000000&selectid=Aldi


#### draw marker

* URL: /draw

* Method: POST

* Request Parameters:

	- *desc:* charachter string

* Example:

- curl http://127.0.0.1:5000/draw?desc=Taskinstraße

## Backend specification

wie sind files gespeichert

## Deployment

give a distance around 1200000 meter, cause data in Tübingen region is limited

## Authors

Tahira Ullah 











