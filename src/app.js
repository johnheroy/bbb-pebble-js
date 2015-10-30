var ajax = require('ajax');
var UI = require('ui');

var main = new UI.Card({
  title: 'Big Blue Bus',
  subtitle: 'Welcome!',
  body: 'Press select to load the upcoming bus arrivals closest to you...',
  titleColor: 'blue'
});

main.show();
// loadStops();

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 15000, 
  timeout: 10000
};

function loadStops() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log('lat', lat, 'lon', lon);
    console.log(lon);
    ajax({
      url: 'http://bbb-api.cloudapp.net/api/arrivals',
      method: 'GET',
      data: {lat: lat, lon: lon},
      type: 'json'
    },
    function(data, status, request) {
      console.log('Nearest bus stops are', JSON.stringify(data));

      var menuSections = [{items: []}];
      var menuItems = menuSections[0].items;
      data.forEach(function(stop) {
        menuItems.push({
          title: stop.stop_name,
          subtitle: stop.stop_desc,
          arrivals: stop.arrivals
        });
      });

      var menu = new UI.Menu({sections: menuSections});
      menu.on('select', function(e) {
        // show the arrivals for a given stop
        // var stopName = e.item.title;
        console.log('stop selected', e.item);
        var arrivals = e.item.arrivals;
        
        var menuSections = [{items: []}];
        var menuItems = menuSections[0].items;
        arrivals.forEach(function(arrival) {
          menuItems.push({
            title: 'Route ' + arrival.route,
            subtitle: arrival.fromNow
          });
        });
        
        var arrivalsMenu = new UI.Menu({sections: menuSections});
        arrivalsMenu.show();
      });
      menu.show();
    },
    function(error, status, request) {
      console.log('The ajax request failed: ' + error);
    });
  }, function() {console.log('there was a location error');}, locationOptions);
}

main.on('click', 'select', function(e) {
  loadStops();
});

