import React, { useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { API_KEY } from './api_key';
import './App.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const [searchMarkers, setSearchMarkers] = useState([]);
  const [clickedMarker, setClickedMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) {
      return;
    }
    const newMarkers = places.map((place) => ({
      position: place.geometry.location,
      place,
    }));
    setSearchMarkers(newMarkers);
    if (places.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      mapRef.current.fitBounds(bounds);
    }
  };

  const onMapClick = (event) => {
    const newMarker = {
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    };
    setClickedMarker(newMarker);
    setSearchMarkers([]); // Clear search markers when a map click occurs
    mapRef.current.panTo(newMarker.position);
  };

  const onBoundsChanged = () => {
    if (!placesServiceRef.current || !mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const request = {
      bounds: bounds,
      type: 'restaurant',
    };

    placesServiceRef.current.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newMarkers = results.map((place) => ({
          position: place.geometry.location,
          place,
        }));
        setSearchMarkers(newMarkers);
      }
    });
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="App">
      <div className="sidebar">
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for places"
            className="search-box" // Apply the CSS class
          />
        </StandaloneSearchBox>
        {selectedPlace && (
          <div className="info-window">
            <h2>{selectedPlace.name}</h2>
            <p>{selectedPlace.formatted_address}</p>
          </div>
        )}
      </div>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
          onLoad={(map) => {
            mapRef.current = map;
            placesServiceRef.current = new window.google.maps.places.PlacesService(map);
            onBoundsChanged(); // Initial search
          }}
          onClick={onMapClick} // Add onClick handler
          onBoundsChanged={onBoundsChanged} // Add onBoundsChanged handler
        >
          {searchMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              onClick={() => setSelectedPlace(marker.place)}
            />
          ))}
          {clickedMarker && (
            <Marker
              position={clickedMarker.position}
              onClick={() => setSelectedPlace(clickedMarker)}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default App;