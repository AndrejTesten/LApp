import { Component, OnInit } from '@angular/core';
import { DailyQuestionsService, Question, Answer } from '../services/daily-questions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-daily-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-questions.component.html',
  styleUrls: ['./daily-questions.component.scss']
})
export class DailyQuestionsComponent implements OnInit {
  question: Question | null = null;
  answers: Answer[] = [];
  myAnswer: string = '';

  constructor(private dqService: DailyQuestionsService) {}

  ngOnInit(): void {
    this.loadQuestion();
  }

  loadQuestion() {
    this.dqService.getTodaysQuestion().subscribe(q => {
      this.question = q;
      this.loadAnswers(q.id);
    });
  }

  loadAnswers(questionId: number) {
    this.dqService.getAnswers(questionId).subscribe(a => this.answers = a);
  }

  submitAnswer() {
    if (!this.question || !this.myAnswer.trim()) return;

    this.dqService.submitAnswer(this.question.id, this.myAnswer).subscribe(ans => {
      this.answers.push(ans);
      this.myAnswer = '';
    });
  }
}
