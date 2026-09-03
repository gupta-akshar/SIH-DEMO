import { useState, useCallback } from 'react';
import { validateCoordinate } from '../utils/geoUtils';

export const useCoordinateSelection = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [history, setHistory] = useState([]); // for undo

  const addCoordinate = useCallback((lat, lng) => {
    if (!isSelectionMode) return;
    if (coordinates.length >= 4) return;
    
    if (validateCoordinate(lat, lng)) {
      setCoordinates(prev => [...prev, { id: prev.length + 1, lat, lng }]);
    }
  }, [coordinates, isSelectionMode]);

  const updateCoordinate = useCallback((index, lat, lng) => {
    if (validateCoordinate(lat, lng)) {
      setCoordinates(prev => {
        const newCoords = [...prev];
        newCoords[index] = { ...newCoords[index], lat, lng };
        return newCoords;
      });
    }
  }, []);

  const resetCoordinates = useCallback(() => {
    setCoordinates([]);
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev);
  }, []);

  const overrideCoordinates = useCallback((newCoordsObject) => {
    // newCoordsObject is expected to be { topLeft, topRight, bottomRight, bottomLeft }
    if (!newCoordsObject) return;
    
    // Save current to history for Undo
    if (coordinates.length === 4) {
      setHistory(prev => [...prev, [...coordinates]]);
    }
    
    const newCoords = [
      { id: 1, lat: newCoordsObject.topLeft.lat, lng: newCoordsObject.topLeft.lng },
      { id: 2, lat: newCoordsObject.topRight.lat, lng: newCoordsObject.topRight.lng },
      { id: 3, lat: newCoordsObject.bottomRight.lat, lng: newCoordsObject.bottomRight.lng },
      { id: 4, lat: newCoordsObject.bottomLeft.lat, lng: newCoordsObject.bottomLeft.lng }
    ];
    setCoordinates(newCoords);
  }, [coordinates]);

  const undoOverride = useCallback(() => {
    if (history.length > 0) {
      const prevCoords = history[history.length - 1];
      setCoordinates(prevCoords);
      setHistory(prev => prev.slice(0, prev.length - 1));
    }
  }, [history]);

  return {
    coordinates,
    isSelectionMode,
    addCoordinate,
    updateCoordinate,
    resetCoordinates,
    toggleSelectionMode,
    overrideCoordinates,
    undoOverride,
    canUndo: history.length > 0,
    isPolygonComplete: coordinates.length === 4
  };
};
