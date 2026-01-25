import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeService, Note, Visit } from './home.service';

describe('HomeService', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService]
    });

    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch recent notes', () => {
    const dummyNotes: Note[] = [
      { user: 'You', message: 'Hello' },
      { user: 'Partner', message: 'Hi' }
    ];

    service.getRecentNotes().subscribe(notes => {
      expect(notes.length).toBe(2);
      expect(notes).toEqual(dummyNotes);
    });

    const req = httpMock.expectOne('/api/home/notes');
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotes);
  });

  it('should fetch upcoming visits', () => {
    const dummyVisits: Visit[] = [
      { startDate: '2026-01-25' },
      { startDate: '2026-01-30' }
    ];

    service.getUpcomingVisits().subscribe(visits => {
      expect(visits.length).toBe(2);
      expect(visits).toEqual(dummyVisits);
    });

    const req = httpMock.expectOne('/api/home/visits');
    expect(req.request.method).toBe('GET');
    req.flush(dummyVisits);
  });
});
