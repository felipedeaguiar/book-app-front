import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { ToastController } from '@ionic/angular';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      // Envie os dados do formulário
      this.http.post<any>('http://localhost/api/login', this.loginForm.value).subscribe(
         (data) => {
          localStorage.setItem('auth_token', data.token);
          this.router.navigate(['/']); // Substitua '/dashboard' pela rota para onde deseja redirecionar
        },
        async (response) => {
          const toast = await this.toastController.create({
            message: response.error.message,
            duration: 1500,
          });
      
          await toast.present();
        });
    }
  }
}
