import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { body } from 'ionicons/icons';
import { ApiService } from 'src/app/services/api.service';
import {IonContent} from "@ionic/angular";

@Component({
  selector: 'app-chat-detail-page',
  templateUrl: './chat-detail-page.page.html',
  styleUrls: ['./chat-detail-page.page.scss'],
})
export class ChatDetailPagePage implements OnInit {
  receiverId: any;
  conversations: any[] = [];
  messageText: string = '';

  @ViewChild(IonContent) content!: IonContent;

  protected pagination = {
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.receiverId = paramsId['id'];
      this.loadMessages(1); // começa da primeira página (últimas mensagens)
    });
  }

  loadMessages(page: number, refresher?: any) {
    this.apiService.get(`messages/${this.receiverId}?page=${page}`).subscribe(
      async (result) => {
        const msgs = result.data.reverse(); // ordem crescente no chat

        if (page === 1) {
          this.conversations = msgs;
          setTimeout(() => this.scrollToBottom(), 100);
        } else {
          this.conversations = [...msgs, ...this.conversations];
        }

        this.pagination = result.pagination;

        if (refresher) refresher.target.complete();
      },
      (error) => {
        console.error('Erro:', error);
        if (refresher) refresher.target.complete();
      }
    );
  }

  loadOlderMessages(event: any) {
    if (this.pagination.current_page < this.pagination.last_page) {
      this.pagination.current_page += 1;

      this.apiService.get(`messages/${this.receiverId}?page=${this.pagination.current_page}`).subscribe(
        async (result) => {
          const msgs = result.data.reverse();

          this.conversations = [...msgs, ...this.conversations];
          event.target.complete();
        },
        (error) => {
          console.error('Erro:', error);
          event.target.complete();
        }
      );
    } else {
      event.target.disabled = true;
      event.target.complete();
    }
  }

  sendMessage() {
    const messageBody = {
      message: this.messageText,
      receiver_id: this.receiverId,
      right: true
    }

    this.apiService.post('messages', messageBody).subscribe(
      (result) => {
        this.conversations.push(messageBody);
        this.messageText = '';
        setTimeout(() => this.scrollToBottom(), 100);
      },
      (error) => {
        console.error('Erro:', error);
      }
    );
  }

  async scrollToBottom() {
    try {
      await this.content.scrollToBottom(300);
    } catch (e) {
      console.warn('scrollToBottom chamado cedo demais');
    }
  }
}
