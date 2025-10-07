import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Route, Router} from "@angular/router";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {

  public contacts: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.carregaContatos();
  }

  carregaContatos() {
    this.apiService.get('contacts').subscribe(
      (data) => {
        this.contacts = data;
      },
      (error) => {
        console.error('Erro:', error);
      });
  }

  openConversation(contact: any) {
    this.modalCtrl.dismiss();

    this.router.navigate(['/tabs/conversations', contact.id]);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
