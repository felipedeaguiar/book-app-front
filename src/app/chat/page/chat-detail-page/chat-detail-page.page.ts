import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { body } from 'ionicons/icons';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-chat-detail-page',
  templateUrl: './chat-detail-page.page.html',
  styleUrls: ['./chat-detail-page.page.scss'],
})
export class ChatDetailPagePage implements OnInit {
  receiverId: any;
  conversations: any;
  messageText: string = '';
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.receiverId = paramsId['id'];
  
    });
    this.loadMessages();
  }
  
  loadMessages() {
    this.apiService.get('messages/'+ this.receiverId).subscribe(
      (result) => {
        this.conversations = result.data;
      },
      (error) => {
        console.error('Erro:', error);
      });
  }

  sendMessage() {

    const messageBody = {  
      message: this.messageText,
      receiver_id: this.receiverId
    }

    this.apiService.post('messages', messageBody).subscribe(
      (result) => {
        this.loadMessages();
      },
      (error) => {
        console.error('Erro:', error);
      });
  }
}
