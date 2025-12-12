import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailModalComponent } from './post-detail-modal.component';

describe('PostDetailModalComponent', () => {
  let component: PostDetailModalComponent;
  let fixture: ComponentFixture<PostDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDetailModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
