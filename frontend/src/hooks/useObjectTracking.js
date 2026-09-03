import { useState, useEffect, useCallback } from 'react';
import { trackingSimulator } from '../services/trackingSimulator';

export const useObjectTracking = () => {
  const [objectState, setObjectState] = useState(null);
  const [trail, setTrail] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const handleUpdate = (state) => {
      setObjectState(state);
      setIsTracking(state.status === 'Online');
      
      setTrail((prev) => {
        const newTrail = [...prev, { lat: state.latitude, lng: state.longitude }];
        if (newTrail.length > 50) return newTrail.slice(newTrail.length - 50); // Keep last 50 points
        return newTrail;
      });
    };

    const unsubscribe = trackingSimulator.subscribeToTrackingUpdates(handleUpdate);
    return () => unsubscribe();
  }, []);

  const startTracking = useCallback(() => trackingSimulator.start(), []);
  const pauseTracking = useCallback(() => trackingSimulator.pause(), []);
  const resetTracking = useCallback(() => {
    trackingSimulator.reset();
    setTrail([]);
    setIsSelected(false);
  }, []);

  const toggleFollow = useCallback(() => setIsFollowing(prev => !prev), []);
  const selectObject = useCallback((select = true) => setIsSelected(select), []);

  return {
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
  };
};
