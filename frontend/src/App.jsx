import React, { useState, useMemo } from 'react';
import { MapView } from './components/map/MapView';
import { CoordinatePanel } from './components/tracking/CoordinatePanel';
import { TrackingPanel } from './components/tracking/TrackingPanel';
import { TrackingDetails } from './components/tracking/TrackingDetails';
import { useCoordinateSelection } from './hooks/useCoordinateSelection';
import { useObjectTracking } from './hooks/useObjectTracking';
import { MapPin, Trash2, Maximize, Target } from 'lucide-react';
import { generateSurroundingCoordinates } from './utils/geoUtils';

function App() {
  const {
    coordinates,
    isSelectionMode,
    addCoordinate,
    updateCoordinate,
    resetCoordinates,
    toggleSelectionMode,
    overrideCoordinates,
    undoOverride,
    canUndo,
    isPolygonComplete
  } = useCoordinateSelection();

  const {
    objectState,
    trail,
    isTracking,
    isFollowing,
    isSelected,
    startTracking,
    pauseTracking,
    resetTracking,
    toggleFollow,
    selectObject
  } = useObjectTracking();

  const [focusBounds, setFocusBounds] = useState(null);

  const handleFitBoundary = () => {
    if (coordinates.length > 0) {
      setFocusBounds(coordinates);
      // Reset after a short delay so the map can fit other boundaries later
      setTimeout(() => setFocusBounds(null), 100);
    }
  };

  const handleFocusObject = () => {
    if (objectState) {
      // Calculate a small boundary around the object to zoom in
      const boundsCoords = generateSurroundingCoordinates(objectState.latitude, objectState.longitude, 0.2);
      setFocusBounds([boundsCoords.topLeft, boundsCoords.bottomRight]);
      setTimeout(() => setFocusBounds(null), 100);
      selectObject(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <MapPin className="mr-2 text-blue-600" />
          Interactive Tracking Dashboard
        </h1>
        <div className="flex space-x-3">
          <button 
            onClick={toggleSelectionMode}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isSelectionMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isSelectionMode ? 'Selection Mode Active' : 'Select Coordinates'}
          </button>
          
          <button 
            onClick={resetCoordinates}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Trash2 size={16} className="mr-2 text-red-500" />
            Reset
          </button>
          
          <button 
            onClick={handleFitBoundary}
            disabled={coordinates.length === 0}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <Maximize size={16} className="mr-2 text-gray-500" />
            Fit Boundary
          </button>
          
          <button 
            onClick={handleFocusObject}
            disabled={!objectState}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition-colors"
          >
            <Target size={16} className="mr-2" />
            Focus Object
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        {/* Map Area */}
        <div className="flex-1 relative rounded-lg shadow-sm">
          <MapView 
            coordinates={coordinates}
            isSelectionMode={isSelectionMode}
            addCoordinate={addCoordinate}
            objectState={objectState}
            trail={trail}
            isFollowing={isFollowing}
            isSelected={isSelected}
            onSelectObject={selectObject}
            focusBounds={focusBounds}
          />
        </div>

        {/* Dashboard Panels */}
        <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col space-y-4 overflow-y-auto pr-2 shrink-0">
          <TrackingPanel 
            objectState={objectState}
            isTracking={isTracking}
            isFollowing={isFollowing}
            startTracking={startTracking}
            pauseTracking={pauseTracking}
            resetTracking={resetTracking}
            toggleFollow={toggleFollow}
          />
          
          <TrackingDetails 
            objectState={objectState}
            isSelected={isSelected}
            onOverride={overrideCoordinates}
            onUndoOverride={undoOverride}
            canUndo={canUndo}
          />
          
          <CoordinatePanel 
            coordinates={coordinates}
            updateCoordinate={updateCoordinate}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
