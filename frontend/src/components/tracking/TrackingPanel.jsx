import React from 'react';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';

export const TrackingPanel = ({
  objectState,
  isTracking,
  isFollowing,
  startTracking,
  pauseTracking,
  resetTracking,
  toggleFollow
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Tracking Controls</h3>
        <div className="flex space-x-1">
          {!isTracking ? (
            <button onClick={startTracking} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Start Simulation">
              <Play size={16} />
            </button>
          ) : (
            <button onClick={pauseTracking} className="p-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" title="Pause Simulation">
              <Pause size={16} />
            </button>
          )}
          <button onClick={resetTracking} className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title="Reset Simulation">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isFollowing} 
            onChange={toggleFollow}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Follow Object on Map</span>
        </label>
      </div>

      {objectState ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Object:</span>
            <span className="font-medium text-sm">{objectState.id}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Status:</span>
            <span className={`font-medium text-sm ${objectState.status === 'Online' ? 'text-green-600' : 'text-red-500'}`}>
              {objectState.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm pb-2 border-b border-gray-100">
            <div>
              <span className="block text-gray-500 text-xs">Latitude</span>
              <span className="font-mono">{objectState.latitude.toFixed(5)}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs">Longitude</span>
              <span className="font-mono">{objectState.longitude.toFixed(5)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm pb-2 border-b border-gray-100">
            <div>
              <span className="block text-gray-500 text-xs">Speed</span>
              <span>{objectState.speed.toFixed(1)} km/h</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs">Heading</span>
              <span>{objectState.heading.toFixed(1)}°</span>
            </div>
          </div>
          <div className="pt-1">
            <span className="block text-gray-500 text-xs mb-1">Last Update</span>
            <span className="text-xs">{new Date(objectState.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No tracking data available.</p>
      )}
    </div>
  );
};
