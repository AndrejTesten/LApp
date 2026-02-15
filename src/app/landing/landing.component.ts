import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HomeService, Note, Visit } from '../services/home.service';
import { NotificationsComponent } from '../shared/notifications/notifications.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationsComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  menuOpen = false;
  countdown = { days: 0 }; // only days
  private timer!: Subscription;

  nextVisit: Visit | null = null;
  celebrationToday = false;
  notes: Note[] = [];

  constructor(public auth: AuthService, private homeService: HomeService) {}

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.timer?.unsubscribe();
  }

  closeMenu() { this.menuOpen = false; }
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  logout() { this.auth.logout(); }

  get recentNotes(): Note[] {
    return this.notes.slice(-3).reverse();
  }

  fetchData() {
    // Fetch next visit
    this.homeService.getNextVisit().subscribe({
      next: visit => {
        this.nextVisit = visit;
        console.log('Next Visit:', this.nextVisit);

        if (!visit?.startDate) return;

        const visitDate = new Date(visit.startDate);
        const today = new Date();

        // Reset time to midnight for comparison
        visitDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);

        // Check if visit is today
        this.celebrationToday = visitDate.getTime() === today.getTime();

        if (!this.celebrationToday) {
          this.startCountdown(visitDate);
        } else {
          this.countdown.days = 0;
        }
      },
      error: () => {
        this.nextVisit = null;
        this.celebrationToday = false;
      }
    });

    // Fetch latest notes
    this.homeService.getRecentNotes().subscribe({
      next: notes => {
        this.notes = notes;
        console.log('Latest Notes:', this.notes);
      },
      error: () => {
        this.notes = [];
      }
    });
  }

  startCountdown(visitDate: Date) {
    this.timer?.unsubscribe();

    this.timer = interval(1000).subscribe(() => {
      const diffMs = visitDate.getTime() - new Date().getTime();
      if (diffMs <= 0) {
        this.countdown.days = 0;
        this.celebrationToday = true;
        this.timer?.unsubscribe();
        return;
      }

      this.countdown.days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    });
  }
}
