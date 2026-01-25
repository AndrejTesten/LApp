import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  user: string;
  message: string | null;
}

export interface Visit {
  startDate: string;      // visit start date
  endDate?: string;  // optional, if you track end date
  city?: string;     // location
  note?: string;     // optional note 💌
  userId?: number;   // optional, if needed
}


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = 'https://localhost:7134/api/home'; // your backend controller route

  constructor(private http: HttpClient) {}

  // Fetch latest 3 notes
  getRecentNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrl}/notes`);
  }

  // Fetch upcoming visits
  getUpcomingVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${this.baseUrl}/visits`);
  }

  getNextVisit(): Observable<Visit> {
  return this.http.get<Visit>(`${this.baseUrl}/nextvisit`);
}
}
