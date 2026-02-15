import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, Notification } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notifService: NotificationsService) {}

  ngOnInit(): void {
    this.notifService.getUnseen().subscribe({
      next: notifs => this.notifications = notifs,
      error: err => console.error('Failed to load notifications', err)
    });
  }

dismiss(notif: Notification) {
  this.notifService.markAsShown(notif.id).subscribe(() => {
    this.notifications = this.notifications.filter(n => n.id !== notif.id);
  });
}

}
