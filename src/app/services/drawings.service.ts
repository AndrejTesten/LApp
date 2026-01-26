import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';

export interface Drawing {
  userId: number;
  drawingData: string;
}

@Injectable({
  providedIn: 'root'
})
export class DrawingsService {
  private baseUrl = 'https://loveapp-qq2l.onrender.com/api/drawings';

constructor(private http: HttpClient, private spinner: SpinnerService) {}

getDrawing(userId: number): Observable<string> {
 return this.http.get(`${this.baseUrl}/${userId}`, { responseType: 'text' })
    .pipe(finalize(() => this.spinner.hide()));}

  saveDrawing(drawing: Drawing): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, drawing);
  }
}
