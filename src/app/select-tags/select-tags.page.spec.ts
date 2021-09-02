import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTagsPage } from './select-tags.page';

describe('SelectTagsPage', () => {
  let component: SelectTagsPage;
  let fixture: ComponentFixture<SelectTagsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTagsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTagsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
