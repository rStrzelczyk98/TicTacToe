import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreComponent } from './score.component';
import { WinnerComponent } from './winner/winner.component';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreComponent, WinnerComponent],
    });
    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render winner component', () => {
    const winner =
      fixture.debugElement.nativeElement.querySelector('app-winner');
    expect(winner).toBeTruthy();
  });
});
