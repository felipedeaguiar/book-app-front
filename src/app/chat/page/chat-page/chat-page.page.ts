import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.page.html',
  styleUrls: ['./chat-page.page.scss'],
})
export class ChatPagePage implements OnInit {
  protected conversations: any;
  avatarCache: { [id: string]: string } = {};
  defaultAvatar = 'assets/default-avatar.png';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadConversations();
  }

  private loadConversations() {
    this.apiService.get('messages').subscribe(
      (data) => {
        this.conversations = data;
        this.conversations.forEach((convo:any) => {
          // pré-carrega os avatares
          this.getUserAvatar(convo.user.id);
        });
      },
      (error) => {
        console.error('Erro:', error);
      });
  }

  public getUserAvatar(id: string) {
    if (this.avatarCache[id]) return this.avatarCache[id];

    this.apiService.getImage(`user/${id}/picture`)
      .subscribe(blob => {
        this.avatarCache[id] = URL.createObjectURL(blob);
      });

    return this.defaultAvatar;
  }

  openConversation(convo: any) {
    this.router.navigate(['/tabs/conversations', convo.user.id]);
  }
}
