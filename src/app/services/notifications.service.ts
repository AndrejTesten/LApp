import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  text: string;
  shown: boolean;
  userId: string; // or number depending on your User model
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  // This must match your backend route exactly
  private apiUrl = 'https://loveapp-qq2l.onrender.com/api/Notifications'; 

  constructor(private http: HttpClient) {}

  /** Get notifications not yet shown to this user */
  getUnseen(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unseen`);
  }

  /** Mark notification as shown */
markAsShown(id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/mark-shown/${id}`, null);
}

}
