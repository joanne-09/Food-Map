import React, { useEffect, useRef } from 'react';
import { API_KEY } from './api_key';
import { Loader } from '@googlemaps/js-api-loader';

const App: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });

        const service = new google.maps.places.PlacesService(map);

        const request = {
          location: { lat: -34.397, lng: 150.644 },
          radius: '500',
          type: ['restaurant'],
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
              if (place.geometry && place.geometry.location) {
                new google.maps.Marker({
                  map,
                  position: place.geometry.location,
                });
              }
            });
          }
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>Restaurant Finder</h1>
      <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

export default App;