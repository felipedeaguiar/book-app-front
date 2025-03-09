import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { ToastController } from '@ionic/angular';
import { Route, Router } from '@angular/router';
import {ApiService} from "../services/api.service";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  protected isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;

    if (this.loginForm.valid) {
       this.authService.login(this.loginForm.value).subscribe(
           (data) => {
             this.authService.setUser(data);
             this.router.navigate(['/']); // Substitua '/dashboard' pela rota para onde deseja redirecionar
          },
          async (response) => {
            const toast = await this.toastController.create({
              message: response.error.message,
              duration: 1500,
            });
            this.isLoading = false;
            await toast.present();
      });
    }
  }
}
