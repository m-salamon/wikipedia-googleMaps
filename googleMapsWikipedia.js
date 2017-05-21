(function () {
    'use strict';
    /* global $ */
    /* global google */

    var search = $('#search'),
        loading = $('#loadingGif'),
        infoBar = $('#infoBar ul'),
        infoArray = [];

    var loc = {
            // // america location
            lat: 40.18275667326753,
            lng: -98.6547956762314
            
            // // lakewood location
//            lat: 40.06114782931379,
//            lng:   -74.21597698307039
        },

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: loc
        });
    
     // // get map center 
//    map.addListener('center_changed', function () {
//        console.log(map.getCenter().lat(), map.getCenter().lng());
//    });

    search.change(function () {
         loading.show();     
        $.getJSON('http://api.geonames.org/wikipediaSearch?maxRows=20&username=morrisal&type=json&callback=?', {
            q: search.val()
        }, function (data) {
            infoArray = [];
            $('#infoBar ul').find('li').remove();
            data.geonames.forEach(function (info) {
                infoArray.push(info);
            });
            console.log(infoArray);
            loading.hide();
            makeMarkers();
        });
    });

    var latLngBounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow({maxWidth: 250});
   
    function makeMarkers() {
        var imageMarker;
            infoArray.forEach(function (info) {
                    if (info.thumbnailImg) {
                        imageMarker = info.thumbnailImg;
                    } else {imageMarker = 'homeIcon.png';} 

            var marker = new google.maps.Marker({
                    position: {
                        lat: info.lat,
                        lng: info.lng
                    },
                    map: map,
                    icon: {
                        url: imageMarker,
                        scaledSize: new google.maps.Size(64, 32)
                    }
                });
                
                var wikiContent = info.summary + "<br>" + '<a target="_blank" href="https://' + info.wikipediaUrl + '">Wikipedia</a>';
                marker.addListener('click', function () {
                     infoWindow.setContent(wikiContent);
                    infoWindow.open(map, marker);
                });
                
                $('img').one( 'error', function() {
                        $(this).attr( 'src', '/images/imgPlaceholder.png' );
                });
 
                $('#myImage').attr( 'src', 'myImage.jpg' );
                
                $('<li id="list"><img  id="infoImg" src="' + imageMarker + '"><span id="infoTitle">' + info.title + '</span></li>').appendTo(infoBar).click(function () {
                    map.panTo({
                        lat: info.lat,
                        lng: info.lng
                    });
                    map.setZoom(12);
                        infoWindow.setContent(wikiContent);
                        infoWindow.open(map, marker);
                    });

                    latLngBounds.extend({
                        lat: info.lat,
                        lng: info.lng
                    });
                });
         map.fitBounds(latLngBounds);
        
        if(infoArray.length === 0){
            infoBar.append('<li id="list"><span id="infoTitle">sorry no results, try again.</span></li>');
        }         
    }

    
    
    
    var drawingManager = new google.maps.drawing.DrawingManager();

        drawingManager.setMap(map);
 
    
    var markers = [];
    var drawings = [];
    
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        console.log(event);
        
        
        // // to save one object and one type to localStorage
/*        if(event.type === google.maps.drawing.OverlayType.MARKER){
            //localStorage.lat = event.overlay.position.lat();
            //localStorage.lng = event.overlay.position.lng();

        }
    });
    
    if(localStorage.lat && localStorage.lng){
        new google.maps.Marker({
         position: {lat: parseFloat(localStorage.lat), lng: parseFloat(localStorage.lng)},
         map: map
        });
    }
*/        
        
        // // to save multiple items of the same type
/*     if(event.type === google.maps.drawing.OverlayType.MARKER){
            //localStorage.marker = JSON.stringify(event.overlay.getPosition());
         
         markers.push(event.overlay.getPosition());
         localStorage.markers = JSON.stringify(markers);
        }
    });
    
    
    if(localStorage.markers){
        
            markers = JSON.parse(localStorage.markers);
            markers.forEach(function(markerLoc){
            
                new google.maps.Marker({
             position: markerLoc,
             map: map
            });
        });        
    }
*/    
    
    
    // // to save multiple types and multiple objects
    if(event.type === google.maps.drawing.OverlayType.MARKER){
        drawings.push({type: google.maps.drawing.OverlayType.MARKER, position: event.overlay.getPosition()});
        } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
            drawings.push({type: google.maps.drawing.OverlayType.CIRCLE, center: event.overlay.getCenter(), radius: event.overlay.getRadius()});
        } else if (event.type === google.maps.drawing.OverlayType.POLYGON){
            drawings.push({type: google.maps.drawing.OverlayType.POLYGON,  paths:  event.overlay.getPath().getArray() });
        } else if (event.type === google.maps.drawing.OverlayType.POLYLINE){
            drawings.push({type: google.maps.drawing.OverlayType.POLYLINE,  path:  event.overlay.getPath().getArray() });
        } else if (event.type === google.maps.drawing.OverlayType.RECTANGLE){
            drawings.push({type: google.maps.drawing.OverlayType.RECTANGLE,  bounds:  event.overlay.getBounds() });
        }
        localStorage.drawings = JSON.stringify(drawings);
        console.log(localStorage.drawings);
    });
    
    
    if(localStorage.drawings){
        
            drawings = JSON.parse(localStorage.drawings);
            drawings.forEach(function (drawing) {
            switch (drawing.type) {
                case google.maps.drawing.OverlayType.MARKER:
                    new google.maps.Marker({
                        position : drawing.position,
                        map: map
                    });
                break;
                case google.maps.drawing.OverlayType.CIRCLE:
                    new google.maps.Circle({
                        center : drawing.center,
                        radius: drawing.radius,
                        map: map
                    });
                break;
                case google.maps.drawing.OverlayType.POLYGON:
                    new google.maps.Polygon({
                        paths: drawing.paths,
                        map: map
                    });
                break;
                case google.maps.drawing.OverlayType.POLYLINE:
                    new google.maps.Polyline({
                        path: drawing.path,
                        map: map
                    });
                break;
                case google.maps.drawing.OverlayType.RECTANGLE:
                    new google.maps.Rectangle({
                        bounds: drawing.bounds,
                        map: map
                    });     
                    
            }
        });        
    }
    
    
    
    
    
    
    
    


}());
