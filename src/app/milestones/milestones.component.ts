import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Milestone {
  title: string;
  date: string;
  description?: string;
  photoUrl?: string;
  highlight?: boolean; // standout milestone
}

@Component({
  selector: 'app-milestones',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss'],
  providers: [DatePipe]
})
export class MilestonesComponent implements OnInit {

  milestones: Milestone[] = [];
  menuOpen = false;

  constructor() {}

  ngOnInit(): void {
    this.milestones = [ { title: 'First IG Message', date: '2025-11-20', description: 'Our very first message on Instagram!', photoUrl: 'assets/msg.PNG' },
      { title: 'First Date', date: '2025-11-27', description: 'Our first date!' }, 
      { title: 'First Trip', date: '2025-11-29', description: 'Our first trip!' },
      { title: 'Museum night', date: '2025-12-03', description: 'Car heartbreak!' },
      { title: 'That smile', date: '2025-12-04', description: 'Explaining Lela smile to my friend', photoUrl: 'assets/smile.jpg' },
      { title: 'Movie night', date: '2025-12-05', description: 'The magical first kiss that healed heart!', highlight: true, } ]; 
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  getTimeTogether(): string {
    const firstKiss = new Date('2025-12-05');
    const now = new Date();
    const diffMs = now.getTime() - firstKiss.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days together`;
  }

getDaysUntilAnniversary(): string {
  const firstKiss = new Date('2025-12-05');
  const today = new Date();

  // Anniversary this year
  let anniversary = new Date(today.getFullYear(), firstKiss.getMonth(), firstKiss.getDate());

  // If anniversary already passed this year, use next year
  if (anniversary < today) {
    anniversary.setFullYear(today.getFullYear() + 1);
  }

  const diffMs = anniversary.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return `${diffDays} day${diffDays !== 1 ? 's' : ''} until anniversary ❤️`;
}

}
