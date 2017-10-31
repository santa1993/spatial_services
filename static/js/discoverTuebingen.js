
var x,y, cat;
var marker_x, marker_y, roads;
var k;
var markers = []; 

 // initialize the map
  var myCenter = new L.LatLng(48.4738, 9.9331);
  var map = L.map('map', {center: myCenter, zoom: 12});

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
  iconAnchor: [0, 0],
  
});

//Icon for categorys
var rewe_icon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Logo_REWE.svg ',
  iconSize: [30, 18],
  iconAnchor: [0, 0],
  
});


var aldi_icon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/64/AldiWorldwideLogo.svg',
  iconSize: [30, 25],
  iconAnchor: [0, 0],
  
});

var netto_icon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Netto_logo.svg ',
  iconSize: [25, 23],
  iconAnchor: [0, 0],
  
});

var edeka_icon = L.icon({
  iconUrl: 'https://vignette.wikia.nocookie.net/logopedia/images/0/00/Edeka_logo.svg/revision/latest?cb=20100710123137',
  iconSize: [20, 23],
  iconAnchor: [0, 0],
  
});




$("#roads").click(function(event) {
	
//add streets
	$.get("http://127.0.0.1:5000/addstreet", function( data ) {
		

		
		roads = JSON.parse(data);
		console.log(data);

		/*features = [];
		for (i=0; i< data.length; i++) {
			
			var roads = data[i][3];
			features.push(roads);
		}
		console.log(features);*/

		var myStyle = {
			"color": "red",
			"weight": 3,
			"opacity": 0.9
			};

		L.geoJson(roads, {
			style: myStyle
		}).addTo(map);
		
	
	});	  
});

	  


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


//for drawed Marker, use POST request and send long lat data and argument ("desc")  to server 
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


//function, in order to remove old markers, if user searchs new address
function removeMarkers(){
  for (i = 0; i <markers.length; i++){
    map.removeLayer(markers[i]);
    }
  }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// if click on ok button, catch arguments
$("#ok").click(function(event) {

  removeMarkers();

  var text = $('#strasse').val();
  var dist = $('#dist').val();
  var cat = $('#selectid').val();
  var zoom = 16;
  
  //send get request to server, in order to get long lat data from adress
  $.get('http://127.0.0.1:5000/adress?' + 'c=' + text, function(data) {

    mydata2 = JSON.parse(data);
	
	

    for (var i = 0; i <mydata2.length; i++){ 

      y = parseFloat(mydata2[i][1]);
      x = parseFloat(mydata2[i][0]);
      name = mydata2[i][3];
	  
    }
    //transform UTM coordinates to geographic coordinates, cause in Leaflet it is not possible to create markers with UTM coor.
    var source = new Proj4js.Proj('EPSG:3857'); 
    var dest = new Proj4js.Proj('EPSG:4326');

    var p = new Proj4js.Point(x,y);
    Proj4js.transform(source, dest, p);

      //create marker
      marker1 = L.marker([p.y, p.x], {
        icon: my_icon,
        zIndexOffset:100

      }).addTo(map);
      marker1.bindPopup("Name: " + name);
      //set view on marker 
      map.setView([p.y, p.x]);
      //push markers in list
      markers.push(marker1);
  


  
  //POST request, send distance from search box as argument to server
  $.ajax({
      url: 'http://127.0.0.1:5000/long_lat?' + 'distanz=' + dist + '&' + 'selectid=' + cat,
      type: "POST", 
      //send x y coordinates
      data: {"x": x, "y": y},
      success: function(data) {
        //get markers within radius
        mydata3 = JSON.parse(data);

        for (var a = 0; a <mydata3.length; a++){
          var y2 = mydata3[a][1];
          var x2 = mydata3[a][0];
          var name = mydata3[a][2];
          
        //transform UTM coordinates to Geographic
        var p2 = new Proj4js.Point(x2,y2);
        Proj4js.transform(source, dest, p2);
        geog_x = p2.x;
        geog_y= p2.y;
        //display marker on map
		
		if (name == "Aldi"){
		
        aldi_marker = L.marker([geog_y, geog_x], {icon: aldi_icon});
        map.addLayer(aldi_marker);
        aldi_marker.bindPopup("Shop: " + name);
      
        //push displayed to list
        markers.push(aldi_marker);
			}
			
		if (name == "Netto"){
		
        netto_marker = L.marker([geog_y, geog_x], {icon: netto_icon});
        map.addLayer(netto_marker);
        netto_marker.bindPopup("Shop: " + name);
      
        //push displayed to list
        markers.push(netto_marker);
			}
		
		if (name == "Rewe"){
		
        rewe_marker = L.marker([geog_y, geog_x], {icon: rewe_icon});
        map.addLayer(rewe_marker);
        rewe_marker.bindPopup("Shop: " + name);
      
        //push displayed to list
        markers.push(rewe_marker);
			}
		
		if (name == "Edeka" || name == "E-Center"){
		
        edeka_marker = L.marker([geog_y, geog_x], {icon: edeka_icon});
        map.addLayer(edeka_marker);
        edeka_marker.bindPopup("Shop: " + name);
      
        //push displayed to list
        markers.push(edeka_marker);
			}
			
		}		
          console.log("success");
        },   
      error: function(xhr) {
        console.log("leider nicht geklappt")
        }
        });
    });
  });
  

  
/////////////////////////////////////////////////////add streets//////////////////////////////////////////////////////




















