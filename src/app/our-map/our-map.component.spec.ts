import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurMapComponent } from './our-map.component';

describe('OurMapComponent', () => {
  let component: OurMapComponent;
  let fixture: ComponentFixture<OurMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
