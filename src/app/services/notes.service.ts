import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  id: number;
  userId: number; // 1 = me, 2 = her
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private api = 'https://localhost:7134/api/notes';

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.api);
  }

  addNote(userId: number, message: string): Observable<Note> {
    return this.http.post<Note>(this.api, { userId, message });
  }
}
