
//load google map and center on old fourth ward    
var sites = [{
      	 lat: 33.7563, 
 	       lng: -84.3735,
         title: 'Martin Luther King, Jr. National Historic Site'
  	     },{
  	     lat: 33.7568, 
  	     lng: -84.3640,
         title: 'Krog Street Market'
  	     },{
  	     lat: 33.7663, 
  	     lng: -84.3563,
         title: 'Jimmy Carter Presidential Library and Museum'
  	     },{
  	     lat: 33.7675, 
  	     lng: -84.3650,
         title: 'Historic Fourth Ward Park'	
  	     },{
  	     lat: 33.7729, 
  	     lng: -84.3657,
         title: 'Ponce City Market'	
  	     }];

//Setup ko.observable data structure.
var atlLocations = function (data) {
  this.title = ko.observable(data.title);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
};

//Global variable to store the response from the ajax request.
var wikiTxt="";

function initMap() {

      //creates google map object with center at old fourth ward atlanta.
      var map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 33.7635, lng: -84.3644},
         zoom: 15
        });

      //calling ko view model.
      ko.applyBindings(new ViewModel(map));
}
  
function ViewModel(map) {
        
      var self = this;
      this.searchKey = ko.observable('');
    	this.locations = ko.observableArray();
    	this.infowindow ;
      this.markers;
    	this.fnd = ko.observable();

      //inserting each site in an observable array
      sites.forEach(function (data) {
          self.locations.push(new atlLocations(data));
      });

      //ajax call to wikipedia to get intro article for each site.
      function wikiFetch(locations, site, marker){
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro&explaintext&titles=' + site+ '&redirects=2&indexpageids=0';

        $.ajax({
          url: wikiUrl,
          dataType: "jsonp",
          success: function(response) {
                      var contentIdx = response.query.pageids[0];
                      wikiTxt = response.query.pages[contentIdx].extract;
                      locations.info = wikiTxt;

                      google.maps.event.addListener(marker,'click', (function(marker){
                      return function() {
                      map.panTo(marker.getPosition());
                      infowindow.setContent(locations.info);
                      infowindow.open(map, marker);

                      // Google Maps API marker animation
                      marker.setAnimation(google.maps.Animation.BOUNCE);
                      setTimeout(function(){ marker.setAnimation(null); }, 900);
                       };
                      })(marker));
                  },

          error: function (response, textStatus, errorThrown) {
                  }
        });

      }

      //create infoWindow object.
      infowindow = new google.maps.InfoWindow({
                      content: ''
        });
 
      //setting the marker and infowindow content for each site.
    	for(i=0;i<sites.length;i++){

      
    		marker = new google.maps.Marker({
    	 		position: {lat: sites[i].lat, lng: sites[i].lng},
    	 		map: map,
          title:sites[i].title
  	     		});

        wikiFetch(self.locations()[i], sites[i].title, marker);

    		google.maps.event.addListener(marker,'click', (function(marker){
    			return function() {
                map.panTo(marker.getPosition());

                infowindow.open(map, marker);

              	// Google Maps API marker animation
              	marker.setAnimation(google.maps.Animation.BOUNCE);
              	setTimeout(function(){ marker.setAnimation(null); }, 900);
            	};
    		})(marker));

        //load marker object of each site into observable array. Used for enable and disable visibility on map.
    		self.locations()[i].markers = marker;

    	}//END FOR loop

      //function to set visible that are not filtered from the search textbox.
      function clearMarker(){
          ko.utils.arrayForEach(self.locations(), function(location){

                location.markers.setVisible(location.title().toLowerCase().includes(self.searchKey().toLowerCase()));
          });
      }

      //function that bounces the marker when user clicks the name in the list.
      self.toggleBounce = function(location) {
        google.maps.event.trigger(location.markers, 'click');        
      }

      //This function is the search filter.
      self.search = ko.computed(function(){
          var index = ko.observableArray([]);
          return ko.utils.arrayFilter(self.locations(), function(location){    

              clearMarker();
              return (location.title().toLowerCase().includes(self.searchKey().toLowerCase()));;
          });

      });

} 