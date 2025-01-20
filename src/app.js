import {apikey} from './apikey.js';

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
    });

    const service = new google.maps.places.PlacesService(map);

    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        searchRestaurants(service, query);
    });
}

function searchRestaurants(service, query) {
    const request = {
        location: { lat: -34.397, lng: 150.644 }, // Replace with user's location
        radius: '500',
        type: ['restaurant'],
        keyword: query,
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                createMarker(place);
            });
        }
    });
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    const infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
    });
}

window.onload = initMap;