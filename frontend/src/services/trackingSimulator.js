import { calculateHeading, calculateDistance } from '../utils/geoUtils';

class TrackingSimulator {
  constructor() {
    this.subscribers = [];
    this.intervalId = null;
    this.isRunning = false;
    this.route = [
      { lat: 31.5204, lng: 74.3587 },
      { lat: 31.5210, lng: 74.3600 },
      { lat: 31.5212, lng: 74.3610 },
      { lat: 31.5195, lng: 74.3620 },
      { lat: 31.5189, lng: 74.3625 },
      { lat: 31.5185, lng: 74.3600 },
      { lat: 31.5182, lng: 74.3579 },
      { lat: 31.5195, lng: 74.3580 }
    ];
    this.currentRouteIndex = 0;
    this.progress = 0; // 0 to 1 between current and next point
    
    this.state = {
      id: 'Vehicle-01',
      name: 'Test Vehicle 01',
      latitude: this.route[0].lat,
      longitude: this.route[0].lng,
      heading: 0,
      speed: 40,
      status: 'Offline',
      lastUpdated: new Date().toISOString()
    };
  }

  subscribeToTrackingUpdates(callback) {
    this.subscribers.push(callback);
    callback(this.state);
    return () => this.unsubscribeFromTrackingUpdates(callback);
  }

  unsubscribeFromTrackingUpdates(callback) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.state.status = 'Online';
    this.notifySubscribers();

    this.intervalId = setInterval(() => {
      this.updatePosition();
    }, 1000); // 1-second updates
  }

  pause() {
    this.isRunning = false;
    this.state.status = 'Paused';
    this.notifySubscribers();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.pause();
    this.currentRouteIndex = 0;
    this.progress = 0;
    this.state = {
      ...this.state,
      latitude: this.route[0].lat,
      longitude: this.route[0].lng,
      heading: 0,
      speed: 40,
      status: 'Offline',
      lastUpdated: new Date().toISOString()
    };
    this.notifySubscribers();
  }

  updatePosition() {
    if (this.route.length < 2) return;

    const startPt = this.route[this.currentRouteIndex];
    const nextIndex = (this.currentRouteIndex + 1) % this.route.length;
    const endPt = this.route[nextIndex];

    const dist = calculateDistance(startPt.lat, startPt.lng, endPt.lat, endPt.lng);
    
    // speed is km/h, convert to km/s
    const speedKmS = this.state.speed / 3600;
    
    // progress increase per second
    const progressDelta = dist > 0 ? speedKmS / dist : 1;
    this.progress += progressDelta;

    if (this.progress >= 1) {
      this.progress = 0;
      this.currentRouteIndex = nextIndex;
      this.updatePosition(); // Calculate next segment immediately
      return;
    }

    const currentLat = startPt.lat + (endPt.lat - startPt.lat) * this.progress;
    const currentLng = startPt.lng + (endPt.lng - startPt.lng) * this.progress;
    const currentHeading = calculateHeading(startPt.lat, startPt.lng, endPt.lat, endPt.lng);

    this.state = {
      ...this.state,
      latitude: currentLat,
      longitude: currentLng,
      heading: currentHeading,
      lastUpdated: new Date().toISOString()
    };

    this.notifySubscribers();
  }
}

export const trackingSimulator = new TrackingSimulator();
