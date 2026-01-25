import { Component, OnInit } from '@angular/core';
import { NotesService, Note } from '../services/notes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports:[CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  message = '';
  myUserId!: number; // current user
  canWriteToday = true;
  todayNoteCount = 0;

  constructor(private notesService: NotesService, private auth: AuthService) {}

  ngOnInit() {
    // Get current logged-in user ID
    this.myUserId = this.auth.getUserId() || 0;
    this.loadNotes();
  }

  loadNotes() {
    this.notesService.getNotes().subscribe(n => {
      this.notes = n.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.updateTodayStatus();
    });
  }

  updateTodayStatus() {
    const today = new Date().toISOString().slice(0, 10);
    this.todayNoteCount = this.notes.filter(
      n => n.userId === this.myUserId && n.createdAt.slice(0, 10) === today
    ).length;
    this.canWriteToday = this.todayNoteCount === 0;
  }

  send() {
    if (!this.canWriteToday || !this.message.trim()) return;

    this.notesService.addNote(this.myUserId, this.message).subscribe({
      next: note => {
        this.notes.unshift(note); // newest on top
        this.message = '';
        this.updateTodayStatus();
      },
      error: err => alert(err.error)
    });
  }

getSender(note: Note): string {
  return note.userId === 1 ? 'Andrej' : 'Laila';
}

}
