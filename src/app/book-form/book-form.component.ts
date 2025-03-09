import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiService} from "../services/api.service";
import {Route, Router} from "@angular/router";
import {LoadingController, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent  implements OnInit {
  myBookForm: FormGroup;
  isLoading = false;

  constructor(
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private apiService: ApiService,
      private modalController: ModalController,
      private loadingController: LoadingController,
      private router: Router
  ) {
    this.myBookForm = this.formBuilder.group({
      book_id: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  onBookSelected(event: any) {
    this.myBookForm.get('book_id')?.setValue(event);
  }

  async save() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Adicionando livro', // Mensagem do loading
      spinner: 'bubbles', // Tipo de spinner
      duration: 0 // O loading vai ficar até ser fechado manualmente
    });

    await loading.present(); // Exibir o loading

    if (this.myBookForm.valid) {
      // Envie os dados do formulário
      this.apiService.post('my-books', this.myBookForm.value).subscribe(
        (data) => {
          loading.dismiss();
          this.modalController.dismiss();
        },
        (error) => {
          console.error('Erro:', error);
        });
    }
  }
}
