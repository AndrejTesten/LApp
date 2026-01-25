import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWordsComponent } from './daily-words.component';

describe('DailyWordsComponent', () => {
  let component: DailyWordsComponent;
  let fixture: ComponentFixture<DailyWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyWordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
