import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip.model';
declare var google: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="map" style="height:500px;width:100%"></div>`,
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() trip!: Trip;

  map!: google.maps.Map;
  carMarker!: google.maps.Marker;
  pathPolyline!: google.maps.Polyline;
  traveledPath: google.maps.LatLng[] = [];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    if (this.trip?.route) {
      this.ngZone.runOutsideAngular(() => setTimeout(() => this.initMap(), 0));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trip'] && this.trip && this.map) {
      this.initMap();
    }
  }

async initMap() {
  const bounds = new google.maps.LatLngBounds();
  this.trip.route.forEach(pt => bounds.extend(pt));

  this.map = new google.maps.Map(document.getElementById('map')!, {
    zoom: 7,
    center: bounds.getCenter(),
  });
  this.map.fitBounds(bounds);

  this.traveledPath = [];
  this.pathPolyline = new google.maps.Polyline({
    map: this.map,
    path: this.traveledPath,
    strokeColor: '#0000FF',
    strokeWeight: 4,
  });

  this.carMarker = new google.maps.Marker({
    map: this.map,
    icon: {
      url: 'assets/car-icon.png',
      scaledSize: new google.maps.Size(50, 50),
      anchor: new google.maps.Point(25, 25),
    },
    position: this.trip.route[0],
  });

  // -------------------------------
  // Build full path across all points
  // -------------------------------
  let fullPath: { lat: number; lng: number }[] = [];

  for (let i = 0; i < this.trip.route.length - 1; i++) {
    const segmentPath = await this.getPathFromDirections(this.trip.route[i], this.trip.route[i + 1]);
    // Remove duplicate point at start of segment
    if (i > 0) segmentPath.shift();
    fullPath = fullPath.concat(segmentPath);
  }

  this.animateCar(fullPath, 4000 * (this.trip.route.length - 1)); // scale duration by number of segments
}


  async getPathFromDirections(start: { lat: number; lng: number }, end: { lat: number; lng: number }) {
    return new Promise<{ lat: number; lng: number }[]>(resolve => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        { origin: start, destination: end, travelMode: google.maps.TravelMode.DRIVING },
        (result: any, status: any) => {
          if (status !== google.maps.DirectionsStatus.OK) {
            console.error('Directions failed', status);
            resolve([start, end]); // fallback straight line
            return;
          }

          const path: google.maps.LatLng[] = [];
          const legs = result.routes[0].legs;
          for (const leg of legs) for (const step of leg.steps) for (const p of step.path) path.push(p);

          const simplified = path.map(p => ({ lat: p.lat(), lng: p.lng() }));
          resolve(simplified);
        }
      );
    });
  }

  animateCar(path: { lat: number; lng: number }[], totalDuration: number) {
    if (path.length < 2) return;

    const fps = 60;
    const interval = 1000 / fps; // ~16ms
    const totalFrames = Math.ceil(totalDuration / interval);
    const fullPath: google.maps.LatLng[] = path.map(p => new google.maps.LatLng(p.lat, p.lng));

    let frame = 0;
    const move = () => {
      const t = frame / totalFrames;
      const index = Math.min(Math.floor(t * (fullPath.length - 1)), fullPath.length - 2);
      const p1 = fullPath[index];
      const p2 = fullPath[index + 1];

      const segmentT = (t * (fullPath.length - 1)) % 1;
      const pos = google.maps.geometry.spherical.interpolate(p1, p2, segmentT);

      this.carMarker.setPosition(pos);
      this.traveledPath.push(pos);
      this.pathPolyline.setPath(this.traveledPath);

      // Rotate toward next point
      const heading = google.maps.geometry.spherical.computeHeading(p1, p2);
      this.carMarker.setIcon({
        url: 'assets/car-icon.png',
        scaledSize: new google.maps.Size(50, 50),
        anchor: new google.maps.Point(25, 25),
        rotation: heading,
      });

      frame++;
      if (frame <= totalFrames) requestAnimationFrame(move);
    };

    move();
  }
}
