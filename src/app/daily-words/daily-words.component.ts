import { Component, OnInit } from '@angular/core';
import { DailyWordsService, DailyWord } from '../services/dailywordsservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-daily-words',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-words.component.html',
  styleUrls: ['./daily-words.component.scss']
})
export class DailyWordsComponent implements OnInit {
  feed: DailyWord[] = [];
  newWord = '';
  newMeaning = '';

  currentUserId!: number;
  receiverId!: number;

  constructor(private service: DailyWordsService, private auth: AuthService) {}

  ngOnInit() {
    // Get current logged-in user ID
    this.currentUserId = this.auth.getUserId()!;
    
    // Set receiver to the other person
    this.receiverId = this.currentUserId === 1 ? 2 : 1;

    this.loadWords();
  }

  loadWords() {
    this.service.getWords(this.currentUserId).subscribe(words => {
      this.feed = words;
    });
  }

  addWord() {
    if (!this.newWord.trim()) return;

    this.service.addWord({
      word: this.newWord,
      meaning: this.newMeaning,
      senderId: this.currentUserId,
      receiverId: this.receiverId
    }).subscribe(() => {
      this.newWord = '';
      this.newMeaning = '';
      this.loadWords();
    });
  }

  toggleLearned(word: DailyWord) {
    // Only the receiver can mark it as learned
    if (word.receiverId !== this.currentUserId) return;

    this.service.toggleLearned(word.id, this.currentUserId).subscribe(() => {
      word.learned = !word.learned;
    });
  }
}
