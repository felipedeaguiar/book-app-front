import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {book} from "ionicons/icons";
import {AlertController, ModalController} from "@ionic/angular";
import {BookFormComponent} from "../book-form/book-form.component";
import {BookModalComponent} from "../book-modal/book-modal.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  myBooks: any[] = [];
  isActionSheetOpen = false;

  constructor(
      private modalCtrl: ModalController,
      private http: HttpClient,
      private alertController: AlertController
  ) {
      this.loadMyBooks();
  }

  ngOnInit() {}
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BookModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  private loadMyBooks() {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+localStorage.getItem('auth_token'), // Exemplo de token de autorização
    });

    // Passa os headers como parte das opções
    const options = { headers: headers };

    this.http.get<any[]>('http://localhost/api/my-books',options).subscribe(
      (data) => {
        this.myBooks = data;
        console.log(this.myBooks);
      },
      (error) => {
        console.error('Erro:', error);
      });
  }
  shareBook(book: any) {
    // Lógica para compartilhar o livro
    console.log(`Sharing book: ${book.name}`);
  }

  async deleteBook(book: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Deleção',
      message: `Você tem certeza que deseja deletar o livro "${book.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Deleção cancelada');
          }
        },
        {
          text: 'Deletar',
          handler: () => {
            const headers = new HttpHeaders({
              'Authorization': 'Bearer '+localStorage.getItem('auth_token'), // Exemplo de token de autorização
            });

            // Passa os headers como parte das opções
            const options = { headers: headers };

            this.http.delete('http://localhost/api/my-books/'+book.id, options).subscribe(
            (data) => {
              const index = this.myBooks.indexOf(book);
              if (index > -1) {
                this.myBooks.splice(index, 1);
              }
              console.log(`Deleted book: ${book.name}`);
            },
              (error) => {
                console.error('Erro:', error);
            });
          }
        }
      ]
    });

    await alert.present();
  }
  async updateCurrentPage(event: any, book: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('auth_token'), // Exemplo de token de autorização
    });

    // Passa os headers como parte das opções
    const options = {headers: headers};

    if (book.pages == event.detail.value) {
      const alert = await this.alertController.create({
        header: 'Finalizar leitura',
        message: `Confirma finalização da leitura de "${book.name}"?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Deleção cancelada');
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              const headers = new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token'), // Exemplo de token de autorização
              });

              // Passa os headers como parte das opções
              const options = {headers: headers};

              // this.http.delete('http://localhost/api/my-books/' + book.id, options).subscribe(
              //   (data) => {
              //     const index = this.myBooks.indexOf(book);
              //     if (index > -1) {
              //       this.myBooks.splice(index, 1);
              //     }
              //     console.log(`Deleted book: ${book.name}`);
              //   },
              //   (error) => {
              //     console.error('Erro:', error);
              //   });
            }
          }
        ]
      });

      await alert.present();
    }

    book.pivot.current_page = event.detail.value;
    this.http.put<any[]>('http://localhost/api/my-books/' + book.id + '/change-page', {'page': event.detail.value}, options).subscribe(
      (data) => {
      },
      (error) => {
        console.error('Erro:', error);
      });
  }

    calculatePorcentage(book: any)
    {
        return Math.round((book.pivot.current_page * 100)/book.pages);
    }

}
