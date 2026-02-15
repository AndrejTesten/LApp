import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  text: string;
  dayNumber: number;
}

export interface Answer {
  id: number;
  questionId: number;
  userId: string;
  text: string;
  answeredAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DailyQuestionsService {
  private apiUrl = 'https://loveapp-qq2l.onrender.com/api/Questions';

  constructor(private http: HttpClient) {}

  getTodaysQuestion(): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/today`);
  }

  getAnswers(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/${questionId}/answers`);
  }

  submitAnswer(questionId: number, text: string): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/${questionId}/answers`, text);
  }
}
