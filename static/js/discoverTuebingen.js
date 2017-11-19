
var x,y, cat;
var marker_x, marker_y, dist;
var k;
var markers = []; 
var circles = [];

 // initialize the map
  var myCenter = new L.LatLng(48.4738, 9.9331);
  var map = L.map('map', {center: myCenter, zoom: 11});

  // load a tile layer
L.tileLayer( 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );


//show coordinates on mouse click
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

//Icon für marker1
var my_icon = L.icon({
  iconUrl: 'http://cdn.mysitemyway.com/icons-watermarks/flat-circle-white-on-red/broccolidry/broccolidry_house/broccolidry_house_flat-circle-white-on-red_512x512.png',
  iconSize: [38, 35],
  iconAnchor: [20, 20]
  
});

function getColor(name) {
          switch (name) {
            case 'Aldi':
              return  'yellow';
            case 'Edeka':
              return 'green';
            case 'Netto':
              return 'orange';
            case 'Rewe':
              return 'grey';
            default:
              return 'white';
          }
        }
		
function labels (feature, layer){
        layer.bindPopup("<p class='info header'>"+ 
        "<b>" + feature.properties.name + "</b>" + 
        "</p>");
        };



/*$("#roads").click(function(event) {
	var dist = $('#dist').val();
//add streets
	$.get("http://127.0.0.1:5000/addstreet?" + 'distanz=' + dist, function( data ) {
		
		
		roads = JSON.parse(data);
		console.log(data);

		/*features = [];
		for (i=0; i< data.length; i++) {
			
			var roads = data[i][3];
			features.push(roads);
		}
		console.log(features);

		var myStyle = {
			"color": "red",
			"weight": 3,
			"opacity": 0.9
			};

		L.geoJson(roads, {
			style: myStyle
		}).addTo(map);
		
	
	});	  
});*/

//Create variable for Leaflet.draw features
var drawnItems = new L.FeatureGroup();

map.addLayer(drawnItems);

//Create Leaflet Draw Control for draw tools and toolbox
var drawControl = new L.Control.Draw({
  draw: {
    polygon: false,
    polyline: false,
    rectangle: false,
    circle: false,
	marker: {
		icon: L.icon({
			iconUrl: 'http://cdn.mysitemyway.com/icons-watermarks/flat-circle-white-on-red/broccolidry/broccolidry_house/broccolidry_house_flat-circle-white-on-red_512x512.png',
			iconSize: [38, 35],
			iconAnchor: [0, 0],
			})
	}
  },
  edit: {
    featureGroup: drawnItems,
    edit: false
  }
});

map.addControl(drawControl);

//draw marker on map
map.on('draw:created', function (e){
  var type = e.layerType;
  layer = e.layer;
  var marker_y = layer.getLatLng().lat;
  var marker_x = layer.getLatLng().lng;

  var tempMarker = drawnItems.addLayer(layer);
  
//on mousover display popup, in order to add new address
tempMarker.on('mouseover', function (e){

  var popupContent = 

    '<form role="form" id="form" enctype="multipart/form-data" class ="form-horizontal" >'+ 
    '<h1>Description</h1>' +
    '<label>Adresse <input type="text" name="desc" id="desc"></label>' + '<br/>'  +
    '<button type="button" class="btn btn-warning" id="submit">Add to Database</button>'+
    '</form>';

  
  var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(popupContent)
    .openOn(map); 

  }); 

  map.addLayer(layer);

  //transform drawed geographic coordinates in UTM 
  var source2 = new Proj4js.Proj('EPSG:4326'); 
  var dest2 = new Proj4js.Proj('EPSG:3857');
  var k = new Proj4js.Point(marker_x, marker_y);
  Proj4js.transform(source2, dest2, k);


//attach a handler to event that match the selector, now or in the future, 
//based on a specific set of root elements
$(document).delegate('#submit', 'click', function(event) {
  event.preventDefault();
  var desc = $('#desc').val();
  
  map.closePopup();


//for drawed Marker, use request and send long lat data and argument to server 
$.ajax({
      url: 'http://127.0.0.1:5000/draw?' + 'desc=' + desc,
      type: "POST",
      data: {"x": k.x, "y": k.y},
      success: function(data) {

          console.log("success");

        },   
      error: function(xhr) {
        console.log("leider nicht geklappt")
        }
  
      });

    });

});


//remove old marker and circle
function removeMarkers(){
  for (i = 0; i <markers.length; i++){
    map.removeLayer(markers[i]);
    }
  }
  
 function removeCircles(){
  for (i = 0; i <circles.length; i++){
    map.removeLayer(circles[i]);
    }
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// if click on ok button, catch arguments
$("#ok").click(function(event) {

  removeMarkers();
  removeCircles();

  var text = $('#strasse').val();
  var dist = $('#dist').val();
  var cat = $('#selectid').val();
  var zoom = 16;
  
  //send request to server, in order to get long lat data from adress
  $.get('http://127.0.0.1:5000/adress?' + 'c=' + text, function(data) {

    mydata2 = JSON.parse(data);
	
	
	
    for (var i = 0; i <mydata2.length; i++){ 
      y = parseFloat(mydata2[i][1]);
      x = parseFloat(mydata2[i][0]);
      name = mydata2[i][3];  
    }
	
    //transform UTM coordinates to geographic coordinates
    var source = new Proj4js.Proj('EPSG:3857'); 
    var dest = new Proj4js.Proj('EPSG:4326');

    var p = new Proj4js.Point(x,y);
    Proj4js.transform(source, dest, p);
	
	console.log("x: " + p.x);
	console.log("y:" + p.y);

      //create marker
      marker1 = L.marker([p.y, p.x], {
        icon: my_icon,
        zIndexOffset:100

      }).addTo(map);
	  
	  map.setView(new L.LatLng(p.y, p.x), 7);
	  
	  //create circle 
	  var circle = L.circle([p.y, p.x], dist).addTo(map);
	  markers.push(circle); 
      //push markers in list
      markers.push(marker1);
  
  
  //send distance from search box as argument to server
  $.ajax({
      url: 'http://127.0.0.1:5000/long_lat?' + 'distanz=' + dist + '&' + 'selectid=' + cat,
      type: "POST", 
      //send UTM x y coordinates
      data: {"x": x, "y": y},
      success: function(data) {
		  
		data = JSON.parse(data);
		console.log(data);
		var shops = L.geoJson(data).addTo(map);
		
		markers.push(shops);
	
			},
		
      error: function(xhr) {
        console.log("leider nicht geklappt")
        }

        });
		
	if( $("#selectid").val() == "All" ) {
		$.ajax({
			url: 'http://127.0.0.1:5000/allMarkers?' + 'distanz=' + dist,
			type: "POST", 
			//send UTM x y coordinates
			data: {"x": x, "y": y},
			success: function(data) {
		  
				data = JSON.parse(data);
				console.log(data);
				var all_shops = L.geoJson(data, {
					pointToLayer: function (feature, latlng) {
						return new L.CircleMarker(latlng, {radius: 6,
														   fillOpacity: 0.8,
														   color: getColor(feature.properties.name),
														   weight: 1
														   });
					},
					onEachFeature: labels
			
				}).addTo(map);
		
				markers.push(all_shops);
	
			},
		
		error: function(xhr) {
			console.log("alle marker konnten nicht geladen weren")
        }

        });
			
		}
		
    });
  });
  

  




















