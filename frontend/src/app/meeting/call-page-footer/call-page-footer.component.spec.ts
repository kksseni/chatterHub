import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPageFooterComponent } from './call-page-footer.component';

describe('CallPageFooterComponent', () => {
  let component: CallPageFooterComponent;
  let fixture: ComponentFixture<CallPageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallPageFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallPageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
