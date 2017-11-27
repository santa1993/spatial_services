# Discover the region of Tübingen

1. The API requests location data around a given radius, and displays result on the map

2. The backend, selects all shops within radius from a user given location.

3. Front end, allows users to add an adress, distance and chose shop category 

4. If user selects all shops category, a pie chart appears


## Installation


### Prerequisites

What things you need to run the service on Windows 64 bit

```
Python27 (if you have already installed)
Flask
Sqlite with Spatialite extension
```

You can use Python27, in order to have access to sqlite3.dll file in "C:\Python27\DLLs",
otherwise use sqlite3.dll in directory "sqlite3_ordner\sqlite3.dll" and set path to system variable

### Installing


Download mod_sptaialite http://www.gaia-gis.it/gaia-sins/windows-bin-amd64/
```
extract files and save dll flies on C:\ drive 
set path to system variable
```
Download sptaialite-gui version 4.3.0  http://www.gaia-gis.it/gaia-sins/windows-bin-amd64/

```
simply download and run the spatialite-gui, it doesn't require any installation
```

Download sptaialite.exe version 4.3 here http://www.gaia-gis.it/gaia-sins/windows-bin-amd64/

```
save zip file spatialite-4.3.0a-win-amd64.7z in directory where database and dll files are
```
install latest version of pip 9.0.1
```
C:\Python27\Scripts>easy_install -U pip 
```
Get pip package, in order to install virtualenv on windows http://flask.pocoo.org/docs/0.12/installation/#windows-easy-install

```
pip install --upgrade pip setuptools

pip install virtualenv

```
Install geojson, in order to create Geojson FeatureCollection from Spatialite
```
pip install geojson 
```
Install Flask:

```
mkdir myproject

cd myproject

virtualenv venv

pip install Flask

```
Open cmd in \path\myproject\venv and execute service:

```
Scripts\activate

set Flask_APP=api.py

set FLASK_DEBUG=1

flask run

```

## API Specification

Base Url: ```http://127.0.0.1:5000/```

Main collection: 
* ```/adress```
				 
* ```/long_lat```
				 
* ```/draw```
				 
#### Give adress name

* URL: /adress

* Method: GET

* Request Parameters:

	- *adress:* charachter string
	
* Response:

	- *long lat*: character string
	
* Example:

- curl http://127.0.0.1:5000/adress?c=Marktplatz 1


#### Set distance around adress

* URL: /long_lat

* Method: POST

* Parameters:

	- *distanz:* integer
	- *cat:* character string
	
* Response:

	- *long lat*: character string

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

create directory "myproject"

install virtualenv 

save api.py and static file in venv\


## Remark

* give a distance around 90.000 meter, cause data in Tübingen region is limited
* and set current path of database

## Authors

Tahira Ullah 











