import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysteryBoxComponent } from './mystery-box.component';

describe('MysteryBoxComponent', () => {
  let component: MysteryBoxComponent;
  let fixture: ComponentFixture<MysteryBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysteryBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysteryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
