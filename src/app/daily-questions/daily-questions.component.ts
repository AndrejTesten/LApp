import { Component, OnInit } from '@angular/core';
import { QuestionsService, CurrentQuestion } from '../services/daily-questions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-daily-questions',
  standalone: true, // ✅ REQUIRED when using imports
  templateUrl: './daily-questions.component.html',
  styleUrls: ['./daily-questions.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class DailyQuestionsComponent implements OnInit {

  current?: CurrentQuestion;
  allAnswered: CurrentQuestion[] = [];
  filteredAnswered: CurrentQuestion[] = []; // ✅ filtered list
  myAnswer: string = '';
  searchTerm: string = ''; // ✅ search input model

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
      next: list => {
        this.allAnswered = list;
        this.filteredAnswered = [...list]; // ✅ initialize filtered list
      },
      error: err => console.error('Failed to load answered questions', err)
    });
  }

  // ✅ Search filter
  filterQuestions() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredAnswered = [...this.allAnswered];
      return;
    }

    this.filteredAnswered = this.allAnswered.filter(q => {

      const questionMatch = q.question.text
        ?.toLowerCase()
        .includes(term);

      const answerMatch = q.answers?.some(a =>
        a.text?.toLowerCase().includes(term)
      );

      return questionMatch || answerMatch;
    });
  }

  getUserName(userId: string): string {
    return userId === '1'
      ? 'Andrej'
      : userId === '2'
      ? 'Laila'
      : userId;
  }

  submitAnswer() {
    if (!this.myAnswer.trim() || !this.current) return;

    this.questionsService
      .submitAnswer(this.current.question.id, this.myAnswer)
      .subscribe({
        next: () => {
          this.myAnswer = '';

          // Reload current question
          this.questionsService.getCurrent().subscribe({
            next: data => this.current = data,
            error: err => {
              if (err.status === 404) {
                this.current = undefined;
              } else {
                console.error('Failed to load new question', err);
              }
            }
          });

          // Reload answered list
          this.loadAllAnswered();
        },
        error: err => console.error('Failed to submit answer', err)
      });
  }
}