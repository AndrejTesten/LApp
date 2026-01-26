import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SecondMessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MysteryService {
  private baseUrl = '/api/mystery'; // backend route

  constructor(private http: HttpClient) {}

  getSecondMessage(): Observable<SecondMessageResponse> {
    return this.http.get<SecondMessageResponse>(`${this.baseUrl}/second-message`);
  }

  getFirstMessage(): Observable<SecondMessageResponse> {
    return this.http.get<SecondMessageResponse>(`${this.baseUrl}/first-message`);
  }
}
