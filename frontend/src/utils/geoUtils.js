export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const rad2deg = (rad) => {
  return rad * (180 / Math.PI);
};

export const calculateHeading = (lat1, lon1, lat2, lon2) => {
  const dLon = deg2rad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(deg2rad(lat2));
  const x =
    Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
    Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(dLon);
  let brng = Math.atan2(y, x);
  brng = rad2deg(brng);
  brng = (brng + 360) % 360;
  return brng;
};

export const generateSurroundingCoordinates = (lat, lng, offsetKm = 0.5) => {
  // Rough approximation: 1 degree latitude is ~111km
  const latOffset = offsetKm / 111;
  const lngOffset = offsetKm / (111 * Math.cos(deg2rad(lat)));

  return {
    topLeft: { lat: lat + latOffset, lng: lng - lngOffset },
    topRight: { lat: lat + latOffset, lng: lng + lngOffset },
    bottomRight: { lat: lat - latOffset, lng: lng + lngOffset },
    bottomLeft: { lat: lat - latOffset, lng: lng - lngOffset }
  };
};

export const validateCoordinate = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
};

export const getPolygonCenter = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  coordinates.forEach(c => {
    if (c.lat < minLat) minLat = c.lat;
    if (c.lat > maxLat) maxLat = c.lat;
    if (c.lng < minLng) minLng = c.lng;
    if (c.lng > maxLng) maxLng = c.lng;
  });
  return {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2
  };
};
