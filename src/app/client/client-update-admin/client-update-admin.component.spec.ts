import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUpdateAdminComponent } from './client-update-admin.component';

describe('ClientUpdateAdminComponent', () => {
  let component: ClientUpdateAdminComponent;
  let fixture: ComponentFixture<ClientUpdateAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUpdateAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUpdateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
