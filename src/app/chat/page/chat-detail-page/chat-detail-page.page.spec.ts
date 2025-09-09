import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatDetailPagePage } from './chat-detail-page.page';

describe('ChatDetailPagePage', () => {
  let component: ChatDetailPagePage;
  let fixture: ComponentFixture<ChatDetailPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDetailPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
