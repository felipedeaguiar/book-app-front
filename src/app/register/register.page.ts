import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api.service";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastController: ToastController,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      old_password: [''],
      password: ['']
    });
   }

  ngOnInit() {
  }

  register() {
    this.isLoading = true;

    if (this.registerForm.valid) {
      this.apiService.post('register', this.registerForm.value).subscribe(
        async (data) => {
          this.registerForm.reset();
          this.isLoading = false;

          const toast = await this.toastController.create({
            message: data.message,
            duration: 3000,
          });
          await toast.present();
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
