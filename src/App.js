import React, { useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import Select from 'react-select';
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
const placeTypes = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'bar', label: 'Bar' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'meal_delivery', label: 'Meal Delivery' },
  { value: 'meal_takeaway', label: 'Meal Takeaway' },
];
const restaurant_marker_url = 'resource/marker-RATING.png';

const App = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [searchMarkers, setSearchMarkers] = useState([]);
  const [nearbySearchMarkers, setNearbySearchMarkers] = useState([]);
  const [clickedMarker, setClickedMarker] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isSelectionBarOpen, setIsSelectionBarOpen] = useState(false);
  const [placeType, setPlaceType] = useState(['restaurant']);
  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);

  const onPlacesChanged = () => {
    try {
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
    } catch (error) {
      console.error('Error adding search markers', error);
    }
  };

  const onMapClick = (event) => {
    try {
      const newMarker = {
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      };
      setClickedMarker(newMarker);
      setSearchMarkers([]); // Clear search markers when a map click occurs
      mapRef.current.panTo(newMarker.position);
    } catch (error) {
      console.error('Error adding clicked marker', error);
    }
  };

  const onBoundsChanged = () => {
    try {
      if (!placesServiceRef.current || !mapRef.current) return;

      const bounds = mapRef.current.getBounds();
      const request = {
        bounds: bounds,
        type: selectedPlaces.map(type => type.value),
      };

      placesServiceRef.current.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const today = new Date().getDay();
          const openTodayResults = results.filter(place => 
            place.opening_hours && 
            place.opening_hours.weekday_text &&
            place.opening_hours.weekday_text[today]
          );

          const newMarkers = openTodayResults.map((place) => ({
            position: place.geometry.location,
            place,
            rating: place.rating >= 4.5 ? restaurant_marker_url.replace('RATING', 'good') :
                    place.rating >= 3.8 ? restaurant_marker_url.replace('RATING', 'medium') :
                                          restaurant_marker_url.replace('RATING', 'bad'),
          }));
          setNearbySearchMarkers(newMarkers);
          setSelectedPlaces(openTodayResults);
        } else {
          console.error('Nearby search request failed', status);
        }
      });
    } catch (error) {
      console.error('Error in onBoundsChanged:', error);
    }
  };
  
  const toggleSelectionBar = () => {
    setIsSelectionBarOpen(!isSelectionBarOpen);
  };

  const searchTypeChange = (options) => {
    setPlaceType(options);
    onBoundsChanged();
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
          <label htmlFor="place-type">Select Place Type:</label>
          <Select
            id="place-type"
            isMulti 
            value={placeType}
            onChange={searchTypeChange}
            options={placeTypes}
            classNamePrefix="select-place"
          />
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