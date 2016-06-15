
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
  	     lat: 33.7707, 
  	     lng: -84.3644,
         title: 'The Masquerade'	
  	     }];

var atlLocations = function (data) {
  this.title = ko.observable(data.title);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
};

var wikiLink=[];
var wikiTxt="";
var text ="<p>%st</p>";

function initMap() {

      var map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 33.7635, lng: -84.3644},
         zoom: 15
        });

      ko.applyBindings(new ViewModel(map));
}
  
function ViewModel(map) {
        
      var self = this;

        //add locations to list.
      this.searchKey = ko.observable('');
    	this.locations = ko.observableArray();
    	this.infowindow ; //= ko.observableArray();
      this.markers;
    	this.fnd = ko.observable();

      sites.forEach(function (data) {
          self.locations.push(new atlLocations(data));
      });

      function wikiFetch(infowindow, site){
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?&format=json&action=query&prop=extracts&exintro&explaintext&titles=' + site+ '&redirects=1&indexpageids=0';
        //var url='hello';

        $.ajax({
          url: wikiUrl,
          dataType: "jsonp",
          success: function(response) {
                      var contentIdx = response.query.pageids[0];
                      wikiTxt = response.query.pages[contentIdx].extract;
                      infowindow.setContent(wikiTxt);
                      wikiLink.push(wikiTxt); 
                      //response.query.pages[contentIdx].extract);                      
                      //self.locations()[i].content = response.query.pages[contentIdx].extract;
                  },

          error: function (response, textStatus, errorThrown) {
                  wikiLink.push('ERROR RETRIEVING ARTICLE '+ errorThrown);
                  }
        });

      }
 
    	for(i=0;i<sites.length;i++){

        //console.log(wikiLink[i]);

        infowindow = new google.maps.InfoWindow({
                      content: ''
        });

    		marker = new google.maps.Marker({
    	 		position: {lat: sites[i].lat, lng: sites[i].lng},
    	 		map: map,
          title:sites[i].title
  	     		});

        wikiFetch(infowindow, sites[i].title);

    		google.maps.event.addListener(marker,'click', (function(marker){
    			return function() {
                map.panTo(marker.getPosition());
                infowindow.open(map, marker);

              	// Google Maps API marker animation
              	marker.setAnimation(google.maps.Animation.BOUNCE);
              	setTimeout(function(){ marker.setAnimation(null); }, 900);
            	};
    		})(marker));

    		self.locations()[i].markers = marker;

    	}//END FOR loop

      function clearMarker(){
          //for(x = 0; x<self.locations().length;x++){
          ko.utils.arrayForEach(self.locations(), function(location){

                location.markers.setVisible(location.title().toLowerCase().includes(self.searchKey().toLowerCase()));

                //if(location.title().toLowerCase().includes(self.searchKey().toLowerCase())){
                  //google.maps.event.trigger(location.markers, 'click');
                //}
          //}
          });
      }

       self.toggleBounce = function(location) {

        //ko.utils.arrayForEach(self.locations(), function(location){
        //if (location.markers.getAnimation() !== null) {
        //      location.markers.setAnimation(null);
        //} else {
        google.maps.event.trigger(location.markers, 'click');

        
      }

      self.search = ko.computed(function(){
          var index = ko.observableArray([]);
          //console.log();
          //self.locations()[i].title().toLowerCase().includes(self.searchKey().toLowerCase())== true)
          //return ko.utils.arrayFilter(self.locations(), function(){
          //return self.locations()[0].title().toLowerCase().includes(self.searchKey().toLowerCase())
          //locations().forEach(function())

          //The following three line performs filtering.
          return ko.utils.arrayFilter(self.locations(), function(location){    

              clearMarker();
              return (location.title().toLowerCase().includes(self.searchKey().toLowerCase()));;
          });

          //return ko.utils.arrayFilter(self.locations(), function(location){

            //return location.title().toLowerCase().includes(self.searchKey().toLowerCase());

          //});   
              
        
          //self.locations.title.toLowerCase.indexOf(self.searchKey);
          //console.log(self.locations().indexOf(self.searchKey().toLowerCase()));
          //});

      });
} 