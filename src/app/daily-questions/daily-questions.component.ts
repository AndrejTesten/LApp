import { Component, OnInit } from '@angular/core';
import { QuestionsService, CurrentQuestion, Answer } from '../services/daily-questions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-daily-questions',
  templateUrl: './daily-questions.component.html',
  styleUrls: ['./daily-questions.component.scss'],
    imports: [CommonModule, FormsModule]

})
export class DailyQuestionsComponent implements OnInit {
  current?: CurrentQuestion;
  allAnswered: CurrentQuestion[] = [];
  myAnswer: string = '';

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.loadCurrent();
    this.loadAllAnswered();
  }

  loadCurrent() {
    this.questionsService.getCurrent().subscribe({
      next: q => this.current = q,
      error: err => console.error('Failed to load current question', err)
    });
  }

  loadAllAnswered() {
    this.questionsService.getAllAnswered().subscribe({
      next: list => this.allAnswered = list,
      error: err => console.error('Failed to load answered questions', err)
    });
  }

 getUserName(userId: string): string {
    return userId === '1' ? 'Andrej' : userId === '2' ? 'Laila' : userId;
  }

  submitAnswer() {
  if (!this.myAnswer.trim() || !this.current) return;

  this.questionsService.submitAnswer(this.current.question.id, this.myAnswer)
    .subscribe({
      next: () => {
        this.myAnswer = '';

        // Reload current question from backend
        this.questionsService.getCurrent().subscribe({
          next: data => this.current = data,
          error: err => {
            if (err.status === 404) {
              // No more questions left
              this.current = undefined;
            } else {
              console.error('Failed to load new question', err);
            }
          }
        });

        // Reload all answered questions
        this.loadAllAnswered();
      },
      error: err => console.error('Failed to submit answer', err)
    });
}

}
