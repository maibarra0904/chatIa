import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Propiedades por defecto para el centro del mapa
const defaultCenter = {
  lat: -2.1447039,
  lng: -79.5770389
};

function MapComponent({ initialLat = defaultCenter.lat, initialLng = defaultCenter.lng }) {
  const [markers, setMarkers] = useState([
    {
      lat: initialLat,
      lng: initialLng,
      time: new Date()
    }
  ]);

  useEffect(() => {
    // Actualizar el marcador inicial cuando los props cambian
    setMarkers([
      {
        lat: initialLat,
        lng: initialLng,
        time: new Date()
      }
    ]);
  }, [initialLat, initialLng]);

  const onMapClick = (event) => {
    setMarkers([
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date()
      }
    ]);
  };

  return (
    <LoadScript
      //googleMapsApiKey="AIzaSyCScLQdrp6qIrxQV1RlHmny0btkNsR-QPM"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: initialLat, lng: initialLng }}
        zoom={10}
        onClick={onMapClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

MapComponent.propTypes = {
  initialLat: PropTypes.number,
  initialLng: PropTypes.number
};

export default MapComponent;
