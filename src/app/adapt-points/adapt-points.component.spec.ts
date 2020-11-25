import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptPointsComponent } from './adapt-points.component';

describe('AdaptPointsComponent', () => {
  let component: AdaptPointsComponent;
  let fixture: ComponentFixture<AdaptPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
