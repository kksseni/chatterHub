import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPageHeaderComponent } from './call-page-header.component';

describe('CallPageHederComponent', () => {
  let component: CallPageHeaderComponent;
  let fixture: ComponentFixture<CallPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallPageHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
