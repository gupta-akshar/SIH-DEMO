import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for the tracked object
const trackingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks for coordinate selection
const MapClickHandler = ({ isSelectionMode, addCoordinate }) => {
  useMapEvents({
    click(e) {
      if (isSelectionMode) {
        addCoordinate(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

// Component to handle auto-focusing/following
const MapUpdater = ({ center, zoom, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      const leafletBounds = L.latLngBounds(bounds.map(c => [c.lat, c.lng]));
      map.fitBounds(leafletBounds, { padding: [50, 50] });
    } else if (center) {
      map.setView([center.lat, center.lng], zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, bounds, map]);
  return null;
};

export const MapView = ({
  coordinates,
  isSelectionMode,
  addCoordinate,
  objectState,
  trail,
  isFollowing,
  isSelected,
  onSelectObject,
  focusBounds
}) => {
  const mapCenter = { lat: 31.5204, lng: 74.3587 };
  const polygonPositions = coordinates.map(c => [c.lat, c.lng]);

  const handleMarkerClick = () => {
    onSelectObject(true);
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler isSelectionMode={isSelectionMode} addCoordinate={addCoordinate} />
        
        {(isFollowing && objectState) && (
          <MapUpdater center={{ lat: objectState.latitude, lng: objectState.longitude }} />
        )}
        
        {focusBounds && (
          <MapUpdater bounds={focusBounds} />
        )}

        {/* Selected Coordinates */}
        {coordinates.map((coord, idx) => (
          <Marker key={`coord-${coord.id}`} position={[coord.lat, coord.lng]}>
            <Popup>
              Point {coord.id} <br />
              Lat: {coord.lat.toFixed(5)} <br />
              Lng: {coord.lng.toFixed(5)}
            </Popup>
          </Marker>
        ))}

        {/* Boundary Polygon */}
        {coordinates.length === 4 && (
          <Polygon positions={polygonPositions} color="blue" fillOpacity={0.2} />
        )}

        {/* Tracking Object */}
        {objectState && (
          <>
            <Marker 
              position={[objectState.latitude, objectState.longitude]} 
              icon={trackingIcon}
              eventHandlers={{ click: handleMarkerClick }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-lg border-b pb-1 mb-2">{objectState.name}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-semibold ${objectState.status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>{objectState.status}</span>
                    
                    <span className="text-gray-500">Lat:</span>
                    <span>{objectState.latitude.toFixed(5)}</span>
                    
                    <span className="text-gray-500">Lng:</span>
                    <span>{objectState.longitude.toFixed(5)}</span>
                    
                    <span className="text-gray-500">Speed:</span>
                    <span>{objectState.speed.toFixed(1)} km/h</span>
                    
                    <span className="text-gray-500">Heading:</span>
                    <span>{objectState.heading.toFixed(1)}°</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Updated: {new Date(objectState.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </Popup>
            </Marker>
            
            {/* Trail */}
            {trail.length > 1 && (
              <Polyline 
                positions={trail.map(t => [t.lat, t.lng])} 
                color="red" 
                weight={3} 
                opacity={0.6}
                dashArray="5, 10"
              />
            )}
            
            {/* Focus Boundary Rectangle (Optional visual cue when selected) */}
            {isSelected && (
              <CircleMarker center={[objectState.latitude, objectState.longitude]} radius={30} color="red" fillOpacity={0.1} />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};
