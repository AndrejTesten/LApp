import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Trip } from "../models/trip.model";

@Injectable({ providedIn: 'root' })
export class TripService {
  private api = 'https://localhost:7134/api/trips';

  constructor(private http: HttpClient) {}

  getTrips() {
    return this.http.get<Trip[]>(this.api);
  }

  addTrip(trip: Trip) {
    return this.http.post(this.api, trip);
  }
}
