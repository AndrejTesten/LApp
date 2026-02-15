import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  text: string;
  shown: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = 'https://loveapp-qq2l.onrender.com/api/Notifications';

  constructor(private http: HttpClient) {}

  getUnseen(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  markAsShown(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-shown/${id}`, {});
  }
}
