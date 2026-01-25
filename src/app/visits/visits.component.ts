import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitsService, Visit } from '../services/visits.service';

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {

  visits: Visit[] = [];
  nextVisit: Visit | null = null;
  daysLeft = 0;

  today = new Date().setHours(0, 0, 0, 0);

  // modal controls
  editing: Visit | null = null;
  showForm = false;
  form: Visit = { id: 0, startDate: '', endDate: '', city: '', note: '' };

  // validation
  minStartDate = new Date().toISOString().split('T')[0];
  formValid = true;
  errorMessage = '';

  constructor(private visitsService: VisitsService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadVisits();
  }

  loadVisits() {
    this.visitsService.getVisits().subscribe(v => {
      this.visits = v.sort((a, b) => a.startDate.localeCompare(b.startDate));
      this.updateNextVisit();
    });
  }

  updateNextVisit() {
    const todayStr = new Date().toISOString().slice(0, 10);
    this.nextVisit = this.visits
      .filter(v => v.startDate >= todayStr)[0] || null;

    if (this.nextVisit) {
      const start = new Date(this.nextVisit.startDate).getTime();
      const now = Date.now();
      this.daysLeft = Math.max(0, Math.ceil((start - now) / (1000 * 60 * 60 * 24)));
    } else {
      this.daysLeft = 0;
    }
  }

openNew() {
    this.form = { id: 0, startDate: '', endDate: '', city: '', note: '' };
    this.editing = null;
    this.showForm = true;
    this.validateDates();
    this.cd.detectChanges(); // ensure view updates
}
  openEdit(v: Visit) {
    this.form = { ...v };
    this.editing = v;
    this.showForm = true;
    this.validateDates();
  }

  validateDates() {
    this.formValid = true;
    this.errorMessage = '';

    if (this.form.startDate && this.form.endDate) {
      if (new Date(this.form.endDate) < new Date(this.form.startDate)) {
        this.formValid = false;
        this.errorMessage = 'End date cannot be before start date.';
      }
    }

    if (this.form.startDate && new Date(this.form.startDate) < new Date(this.minStartDate)) {
      this.formValid = false;
      this.errorMessage = 'Start date cannot be in the past.';
    }
  }

  save() {
    if (!this.formValid) return;

    if (this.editing) {
      this.visitsService.updateVisit(this.form).subscribe(updated => {
        Object.assign(this.editing!, updated);
        this.updateNextVisit();
      });
    } else {
      this.visitsService.addVisit(this.form).subscribe(created => {
        this.visits.push(created);
        this.visits.sort((a, b) => a.startDate.localeCompare(b.startDate));
        this.updateNextVisit();
      });
    }

    this.showForm = false;
  }

  cancel() {
    this.showForm = false;
  }

  deleteVisit(id: number) {
    if (!confirm('Delete this visit?')) return;
    this.visitsService.deleteVisit(id).subscribe(() => {
      this.visits = this.visits.filter(v => v.id !== id);
      this.updateNextVisit();
    });
  }

  // helpers for template
  get pastVisits() {
    return this.visits.filter(v => new Date(v.startDate).getTime() < this.today);
  }

  get futureVisits() {
    return this.visits.filter(v => new Date(v.startDate).getTime() >= this.today);
  }
}
