import React, { useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import './App.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
  lat: 24.9605715,
  lng: 121.5337262,
};
const restaurant_marker_url = 'resource/marker-RATING.png';

const App = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [searchMarkers, setSearchMarkers] = useState([]);
  const [nearbySearchMarkers, setNearbySearchMarkers] = useState([]);
  const [clickedMarker, setClickedMarker] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isSelectionBarOpen, setIsSelectionBarOpen] = useState(false);
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
          rating: place.rating >= 4.5 ? restaurant_marker_url.replace('RATING', 'good') : 
                  place.rating >= 3.8 ? restaurant_marker_url.replace('RATING', 'medium') : 
                                        restaurant_marker_url.replace('RATING', 'bad'),
        }));
        setNearbySearchMarkers(newMarkers);
        setSelectedPlaces(results);
      }
    });
  };

  const toggleSelectionBar = () => {
    setIsSelectionBarOpen(!isSelectionBarOpen);
  };

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="App">
      <div className="sidebar">
        <div className="search-box-container">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="search-box-wrapper">
              <img src="resource/search.png" alt="Search Icon" className="search-box-icon"/>
              <input
                type="text"
                placeholder="Search for places"
                className="search-box" // Apply the CSS class
              />
            </div>
          </StandaloneSearchBox>
        </div>
        <div className="place-info-wrapper">
          {selectedPlaces.length > 0 && (
            <div>
              {selectedPlaces
                .sort((a, b) => b.rating - a.rating) // Sort by rating
                .map((place, index) => (
                  <div key={index} className="place-info">
                    <img src={place.photos ? place.photos[0].getUrl() : 'resource/search.png'} alt={place.name} />
                    <div>
                      <h3>{place.name}</h3>
                      <p>Rating: {place.rating || 'No rating available'}</p>
                      <p>{place.formatted_address}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={11}
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
            />
          ))}
          {clickedMarker && (
            <Marker
              position={clickedMarker.position}
            />
          )}
          {nearbySearchMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={{
                url: marker.rating,
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          ))}
        </GoogleMap>
      </div>
      <div className={`selection-bar ${isSelectionBarOpen ? 'open' : ''}`}>
        <div className="selection-bar-content">
          <h2>Selection Bar</h2>
          <p>Content...</p>
        </div>
      </div>
      <img
        src="resource/menu.png"
        alt="Menu"
        className="selection-bar-icon"
        onClick={toggleSelectionBar}
      />
    </div>
  );
};

export default App;