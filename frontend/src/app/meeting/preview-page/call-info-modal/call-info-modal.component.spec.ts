import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallInfoModalComponent } from './call-info-modal.component';

describe('CallInfoModalComponent', () => {
  let component: CallInfoModalComponent;
  let fixture: ComponentFixture<CallInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
