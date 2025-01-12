import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent  implements OnInit {
  myBookForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
      private http: HttpClient
  ) {
    this.myBookForm = this.formBuilder.group({
      book_id: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  onBookSelected(event: any) {
    this.myBookForm.get('book_id')?.setValue(event);
  }

  save() {
    if (this.myBookForm.valid) {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+localStorage.getItem('auth_token'), // Exemplo de token de autorização
      });

      // Passa os headers como parte das opções
      const options = { headers: headers };

      // Envie os dados do formulário
      this.http.post<any[]>('http://localhost/api/my-books', this.myBookForm.value, options).subscribe(
        (data) => {
          console.log('criado com sucesso');
        },
        (error) => {
          console.error('Erro:', error);
        });
    }
  }
}
