import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEditarVacunaComponent } from './agregar-editar-vacuna.component';

describe('AgregarEditarVacunaComponent', () => {
  let component: AgregarEditarVacunaComponent;
  let fixture: ComponentFixture<AgregarEditarVacunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarEditarVacunaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarEditarVacunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
