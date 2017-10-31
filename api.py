from flask import Flask, request
import sqlite3
from flask import g
import sys
import json
import geojson
from json import dumps
reload(sys)
sys.setdefaultencoding('utf-8')
from flask import session



app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')   


DATABASE = "C:\\spatialite\\tuebingen_map.sqlite"


def connect_db():
    return sqlite3.connect(DATABASE, isolation_level=None)


@app.before_request
def before_request():
    g.db = connect_db()
    g.db.enable_load_extension(True)
    g.db.execute("SELECT load_extension('C:/spatialite/mod_spatialite')")
    print "succesful"
	

@app.route('/adress', methods=['GET'])
def adress():
	conn = g.db.cursor()
	c = request.args['c']
	
	query = conn.execute('''SELECT ST_X(geometry), ST_Y(geometry),node_id, streets FROM adressen_tuebingen
		WHERE streets LIKE (?) ''', ['%'+c+'%'])
	string_result = conn.fetchall()
	string_result = json.dumps(string_result)
	print string_result
	return string_result

@app.route('/long_lat', methods=['POST', 'GET'])
def long_lat():
	conn = g.db.cursor()
	x = request.form['x']
	y = request.form['y']

	distanz = request.args['distanz']
	cat = request.args['selectid']
	conn.execute('''SELECT ST_X(a.geometry), ST_Y(a.geometry), a.name, a.node_id
        FROM shops_tuebingen
        AS a 
        WHERE Contains(Buffer(GeomFromText('POINT(%s %s)', 3857), %s), a.geometry) AND name = '%s' AND a.ROWID 
        IN (SELECT ROWID FROM SpatialIndex WHERE f_table_name = 'shops_tuebingen' 
        AND search_frame = Buffer(GeomFromText('POINT(%s %s)', 3857), %s)) ''' % (x, y, distanz, cat, x, y, distanz))

	result_buffer = conn.fetchall()
	result_buffer = json.dumps(result_buffer)
	print result_buffer
	return result_buffer



@app.route('/draw', methods=['POST'])
def draw():
	conn = g.db.cursor()
	x = request.form['x']
	y = request.form['y']
	desc = request.args['desc']
	print x,y,desc
	conn.execute('''INSERT INTO adressen_tuebingen(node_id, streets, geometry) 
		VALUES (NULL, '%s', GeomFromText('POINT(%s %s)', 3857))''' % (desc, x, y))
	result = conn.fetchall()
	result = json.dumps(result)
	return result
	


@app.route('/addstreet', methods=['GET', 'POST'])
def addstreet():
	conn = g.db.cursor()
	conn.execute('''select id,name,sub_type, AsGeoJSON(ST_GeomFromText(geom)) as geometry FROM strassen_tu2 WHERE id="4056907" ''')
	# function that makes query results return lists of dictionaries instead of lists of tuples
	def dict_factory(cursor, row):
		d = {}
		for idx,col in enumerate(cursor.description):
			d[col[0]] = row[idx]
		return d
	# apply the function to the sqlite3 engine
	conn.row_factory = dict_factory
	result = conn.fetchall()
	#result = json.dumps(result)
	# create a new list which will store the single GeoJSON features
	featureCollection = list()
	# iterate through the list of result dictionaries
	for row in result:
		# create a single GeoJSON geometry from the geometry column which already contains a GeoJSON string
		geom = geojson.loads(row['geometry'])
		#remove the geometry field from the current's row's dictionary
		row.pop('geometry')
		# create a new GeoJSON feature and pass the geometry columns as well as all remaining attributes which are stored in the row dictionary
		feature = geojson.Feature(geometry=geom, properties=row)
		# append the current feature to the list of all features
		featureCollection.append(feature)
	
	# when single features for each row from the database table are created, pass the list to the FeatureCollection constructor which will merge them together into one object
	featureCollection = geojson.FeatureCollection(featureCollection)
	# print the FeatureCollection as string
	GeoJSONFeatureCollectionAsString = geojson.dumps(featureCollection)
	print(GeoJSONFeatureCollectionAsString)
	return GeoJSONFeatureCollectionAsString
	
@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'db'):
        g.db.close()








