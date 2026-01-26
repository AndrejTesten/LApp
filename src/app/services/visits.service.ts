import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Visit {
  id: number;
  startDate: string;
  endDate?: string;
  city?: string;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitsService {
  private baseUrl = 'https://loveapp-qq2l.onrender.com/api/visits';

  constructor(private http: HttpClient) {}

  getVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.baseUrl);
  }

  addVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(this.baseUrl, visit);
  }

  updateVisit(visit: Visit): Observable<Visit> {
    return this.http.put<Visit>(`${this.baseUrl}/${visit.id}`, visit);
  }

  deleteVisit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
