// questions.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  text: string;
}

export interface Answer {
  id: number;
  questionId: number;
  userId: string;
  text: string;
}

export interface CurrentQuestion {
  question: Question;
  answers: Answer[];
}

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  private apiUrl = 'https://loveapp-qq2l.onrender.com/api/questions';

  constructor(private http: HttpClient) {}

getCurrent(): Observable<CurrentQuestion> {
  return this.http.get<CurrentQuestion>(`${this.apiUrl}/current`);
}

submitAnswer(questionId: number, text: string) {
  if (!questionId) {
    throw new Error("Question ID is undefined");
  }

  return this.http.post<Answer>(
    `${this.apiUrl}/${questionId}/answers`,
    { text }, // send JSON
    { headers: { 'Content-Type': 'application/json' } }
  );
}




  getAllAnswered(): Observable<{ question: Question, answers: Answer[] }[]> {
    return this.http.get<{ question: Question, answers: Answer[] }[]>(`${this.apiUrl}/all`);
  }
}
