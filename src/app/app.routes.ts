import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { DrawComponent } from './draw/draw.component';
import { MapComponent } from './map/map.component';
import { VisitsComponent } from './visits/visits.component';
import { NotesComponent } from './notes/notes.component';
import { DailyWordsComponent } from './daily-words/daily-words.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { OurMapComponent } from './our-map/our-map.component';
import { MysteryBoxComponent } from './mystery-box/mystery-box.component';
import { authGuard } from './services/auth.guard'; // <-- import your guard

export const routes: Routes = [
  // Redirect root to login if not logged in
{ path: '', redirectTo: 'login', pathMatch: 'full' }

  // Protected routes
  { path: 'home', component: LandingComponent, canActivate: [authGuard] },
  { path: 'draw', component: DrawComponent, canActivate: [authGuard] },
  { path: 'trip-list', component: TripListComponent, canActivate: [authGuard] },
  { path: 'visits', component: VisitsComponent, canActivate: [authGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [authGuard] },
  { path: 'words', component: DailyWordsComponent, canActivate: [authGuard] },
  { path: 'our-map', component: OurMapComponent, canActivate: [authGuard] },
  { path: 'mystery', component: MysteryBoxComponent, canActivate: [authGuard] },

  // Login page (unprotected)
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },

  // Catch-all
  { path: '**', redirectTo: 'home' }
];
