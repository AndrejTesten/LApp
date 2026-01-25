import { Component } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { Trip } from '../models/trip.model';
import { MapComponent } from '../map/map.component';
import { TripService } from '../services/trip.serivce';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, MapComponent],
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent {
  trips: Trip[] = [];
  selectedTrip: Trip | null = null;

  constructor(private tripService: TripService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe(t => this.trips = t);
  }

  selectTrip(trip: Trip) {
    this.selectedTrip = trip;
  }

  closeTrip() {
    this.selectedTrip = null;
  }
}
