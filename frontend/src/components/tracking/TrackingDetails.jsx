import React, { useMemo } from 'react';
import { generateSurroundingCoordinates } from '../../utils/geoUtils';
import { Replace, Undo } from 'lucide-react';

export const TrackingDetails = ({
  objectState,
  isSelected,
  onOverride,
  onUndoOverride,
  canUndo
}) => {
  const surroundingCoords = useMemo(() => {
    if (!objectState || !isSelected) return null;
    return generateSurroundingCoordinates(objectState.latitude, objectState.longitude, 0.5); // 0.5km boundary
  }, [objectState, isSelected]);

  const handleOverride = () => {
    if (window.confirm('Are you sure you want to override the selected map coordinates with this tracking boundary?')) {
      onOverride(surroundingCoords);
    }
  };

  if (!isSelected) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-2">Tracking Boundary</h3>
        <p className="text-gray-500 text-sm">Select the tracking object on the map to calculate its surrounding boundary.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-3">Tracking Boundary</h3>
      
      {surroundingCoords && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 p-2 rounded border border-blue-100 text-xs">
              <span className="block font-semibold text-blue-800 mb-1">Top Left</span>
              <span className="block text-gray-700">Lat: {surroundingCoords.topLeft.lat.toFixed(5)}</span>
              <span className="block text-gray-700">Lng: {surroundingCoords.topLeft.lng.toFixed(5)}</span>
            </div>
            <div className="bg-blue-50 p-2 rounded border border-blue-100 text-xs">
              <span className="block font-semibold text-blue-800 mb-1">Top Right</span>
              <span className="block text-gray-700">Lat: {surroundingCoords.topRight.lat.toFixed(5)}</span>
              <span className="block text-gray-700">Lng: {surroundingCoords.topRight.lng.toFixed(5)}</span>
            </div>
            <div className="bg-blue-50 p-2 rounded border border-blue-100 text-xs">
              <span className="block font-semibold text-blue-800 mb-1">Bottom Left</span>
              <span className="block text-gray-700">Lat: {surroundingCoords.bottomLeft.lat.toFixed(5)}</span>
              <span className="block text-gray-700">Lng: {surroundingCoords.bottomLeft.lng.toFixed(5)}</span>
            </div>
            <div className="bg-blue-50 p-2 rounded border border-blue-100 text-xs">
              <span className="block font-semibold text-blue-800 mb-1">Bottom Right</span>
              <span className="block text-gray-700">Lat: {surroundingCoords.bottomRight.lat.toFixed(5)}</span>
              <span className="block text-gray-700">Lng: {surroundingCoords.bottomRight.lng.toFixed(5)}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleOverride}
              className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Replace size={16} />
              <span>Override Coordinates</span>
            </button>
            
            {canUndo && (
              <button
                onClick={onUndoOverride}
                className="flex items-center justify-center space-x-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                title="Undo Override"
              >
                <Undo size={16} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
