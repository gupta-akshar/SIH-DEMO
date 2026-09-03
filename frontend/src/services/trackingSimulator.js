import { calculateHeading, calculateDistance } from '../utils/geoUtils';

class TrackingSimulator {
  constructor() {
    this.subscribers = [];
    this.intervalId = null;
    this.isRunning = false;
    this.route = [
      { lat: 18.940, lng: 72.805 }, // Arabian Sea near Mumbai
      { lat: 18.935, lng: 72.800 },
      { lat: 18.930, lng: 72.795 },
      { lat: 18.925, lng: 72.795 },
      { lat: 18.920, lng: 72.790 },
      { lat: 18.915, lng: 72.795 },
      { lat: 18.910, lng: 72.800 },
      { lat: 18.905, lng: 72.805 }
    ];
    this.currentRouteIndex = 0;
    this.progress = 0; // 0 to 1 between current and next point
    
    this.state = {
      id: 'Ship-01',
      name: 'Cargo Vessel Alpha',
      latitude: this.route[0].lat,
      longitude: this.route[0].lng,
      heading: 0,
      speed: 25, // ships are slower
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
      speed: 25,
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
