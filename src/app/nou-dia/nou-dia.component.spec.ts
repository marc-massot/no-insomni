import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouDiaComponent } from './nou-dia.component';

describe('NouDiaComponent', () => {
  let component: NouDiaComponent;
  let fixture: ComponentFixture<NouDiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NouDiaComponent]
    });
    fixture = TestBed.createComponent(NouDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
