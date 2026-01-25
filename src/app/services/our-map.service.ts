import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MemoryImage {
  fileName: string;
  base64Data: string;
}

export interface MemoryPin {
  id?: number;
  title: string;
  text: string;
  lat: number;
  lng: number;
  images: string[]; // base64 strings for display
}

export interface NewPinDto {
  title: string;
  text: string;
  lat: number;
  lng: number;
  images: MemoryImage[];
}

@Injectable({
  providedIn: 'root'
})
export class OurMapService {

  private apiUrl = 'https://localhost:7134/api/OurMap'; // your backend controller URL

  constructor(private http: HttpClient) {}

  /** Fetch all pins with images */
  getPins(): Observable<MemoryPin[]> {
    return this.http.get<MemoryPin[]>(this.apiUrl);
  }

  /** Add a new pin with base64 images */
  addPin(pin: NewPinDto): Observable<any> {
    return this.http.post(this.apiUrl, pin);
  }

  /** Delete a pin by ID */
deletePin(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

}
