import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DailyWord {
  id: number;
  word: string;
  meaning?: string;
  senderId: number;
  receiverId: number;
  learned: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DailyWordsService {
  private apiUrl = 'https://loveapp-qq2l.onrender.com/api/DailyWords';

  constructor(private http: HttpClient) {}

  getWords(userId: number): Observable<DailyWord[]> {
    return this.http.get<DailyWord[]>(`${this.apiUrl}/${userId}`);
  }

  addWord(word: Partial<DailyWord>): Observable<DailyWord> {
    return this.http.post<DailyWord>(this.apiUrl, word);
  }

  toggleLearned(wordId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${wordId}/learned/${userId}`, {});
  }
}
