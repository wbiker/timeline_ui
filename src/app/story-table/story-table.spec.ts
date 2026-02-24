import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryTable } from './story-table';

describe('StoryTable', () => {
  let component: StoryTable;
  let fixture: ComponentFixture<StoryTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
