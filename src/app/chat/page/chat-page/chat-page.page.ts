import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {Router} from "@angular/router";
import {BookModalComponent} from "../../../book-modal/book-modal.component";
import {ContactListPage} from "../../../contact/contact-list/contact-list.page";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.page.html',
  styleUrls: ['./chat-page.page.scss'],
})
export class ChatPagePage implements OnInit {
  protected conversations: any;
  avatarCache: { [id: string]: string } = {};
  defaultAvatar = 'assets/avatar.svg';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalCtrl: ModalController,
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
          if (convo.user.profile_pic) {
            this.getUserAvatar(convo.user.id);
          }
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

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ContactListPage,
    });

    modal.present();
  }
}
