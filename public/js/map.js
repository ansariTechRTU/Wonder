mapboxgl.accessToken = mapToken ;

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12',
center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 9 // starting zoom
});


//marker
const marker = new mapboxgl.Marker({color: '#ff4d4d', scale: 1.2})
.setLngLat(listing.geometry.coordinates)     //listing geometry coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`
     <div style="
      background-color: #ffcccc;
      border-radius: 50%;
      width: 150px;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 15px;
    ">
      <p style="margin:5px 0 0; font-size:12px;">Exact location provided after booking</p>
      <h4 style="margin:0; color:#cc0000;">${listing.location}</h4>
      
    </div>
    `))
.addTo(map);