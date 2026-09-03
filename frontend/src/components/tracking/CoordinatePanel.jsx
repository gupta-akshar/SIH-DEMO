import React from 'react';

export const CoordinatePanel = ({ coordinates, updateCoordinate }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-3">Selected Coordinates</h3>
      {coordinates.length === 0 && (
        <p className="text-gray-500 text-sm">No coordinates selected. Enable "Select Coordinates" and click on the map.</p>
      )}
      <div className="space-y-4">
        {coordinates.map((coord, idx) => (
          <div key={coord.id} className="bg-gray-50 p-3 rounded-md border border-gray-100">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Point {coord.id}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input 
                  type="number" 
                  step="0.00001"
                  value={coord.lat}
                  onChange={(e) => updateCoordinate(idx, parseFloat(e.target.value), coord.lng)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input 
                  type="number" 
                  step="0.00001"
                  value={coord.lng}
                  onChange={(e) => updateCoordinate(idx, coord.lat, parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
